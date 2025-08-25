import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
// import { createPost } from "./mcp.tool.js";
import { z } from "zod";
import { executeFind, executeInsertOne, executeUpdateOne, executeDeleteOne, executeAggregate, findAllcollections } from "./db/mongodb.tool.js";
import { connectToDatabase, closeConnection } from "./db/mongodb.js";

const server = new McpServer({
    name: "example-server",
    version: "1.0.0"
});

// ... set up server resources, tools, and prompts ...

const app = express();


server.tool(
    "addTwoNumbers",
    "Add two numbers",
    {
        a: z.number(),
        b: z.number()
    },
    async (arg) => {
        const { a, b } = arg;
        return {
            content: [
                {
                    type: "text",
                    text: `The sum of ${a} and ${b} is ${a + b}`
                }
            ]
        }
    }
)



server.tool(
    "findAllcollections",

    "Find all collections in a MongoDB database",
    async () => {
        return findAllcollections();

    }
);



// MongoDB tools
server.tool(
    "findDocuments",
    "Find documents in a MongoDB collection",
    {
        collection: z.string(),
        query: z.any().optional(),
        options: z.any().optional()
    },
    async (arg) => {
        const { collection, query, options } = arg;
        return executeFind(collection, query || {}, options || {});
    }
);

server.tool(
    "insertDocument",
    "Insert a document into a MongoDB collection",
    {
        collection: z.string(),
        document: z.any()
    },
    async (arg) => {
        const { collection, document } = arg;
        return executeInsertOne(collection, document);
    }
);

server.tool(
    "updateDocument",
    "Update a document in a MongoDB collection",
    {
        collection: z.string(),
        filter: z.any(),
        update: z.any()
    },
    async (arg) => {
        const { collection, filter, update } = arg;
        return executeUpdateOne(collection, filter, update);
    }
);

server.tool(
    "deleteDocument",
    "Delete a document from a MongoDB collection",
    {
        collection: z.string(),
        filter: z.any()
    },
    async (arg) => {
        const { collection, filter } = arg;
        return executeDeleteOne(collection, filter);
    }
);

// server.tool(
//     "aggregateDocuments",
//     "Execute an aggregation pipeline on a MongoDB collection",
//     {
//         collection: z.string(),
//         pipeline: z.array(z.object({
//             stage: z.string().describe("The aggregation stage name (e.g., $match, $group, $sort)"),
//             params: z.any().describe("The parameters for this aggregation stage")
//         }))
//     },
//     async (arg) => {
//         const { collection, pipeline } = arg;
//         // Convert the simplified pipeline format to MongoDB's format
//         const mongoDbPipeline = pipeline.map(stage => {
//             const { stage: stageName, params } = stage;
//             return { [stageName]: params };
//         });
//         return executeAggregate(collection, mongoDbPipeline);
//     }
// );

// server.tool(
//     "createPost",
//     "Create a post on X formally known as Twitter ", {
//     status: z.string()
// }, async (arg) => {
//     const { status } = arg;
//     return createPost(status);
// })


// to support multiple simultaneous connections we have a lookup object from
// sessionId to transport
const transports = {};

app.get("/sse", async (req, res) => {
    const transport = new SSEServerTransport('/messages', res);
    transports[ transport.sessionId ] = transport;
    res.on("close", () => {
        delete transports[ transport.sessionId ];
    });
    await server.connect(transport);
});

app.post("/messages", async (req, res) => {
    const sessionId = req.query.sessionId;
    const transport = transports[ sessionId ];
    if (transport) {
        await transport.handlePostMessage(req, res);
    } else {
        res.status(400).send(`No transport found for sessionId ${sessionId}`);
    }
});

// Connect to MongoDB when the server starts
connectToDatabase()
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch(err => {
        console.error("Failed to connect to MongoDB:", err);
    });

// Close MongoDB connection when the server shuts down
process.on('SIGINT', async () => {
    await closeConnection();
    process.exit(0);
});

app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});
