// import express from "express";
// import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
// // import { createPost } from "./mcp.tool.js";
// import { z } from "zod";
// import { executeFind, executeInsertOne, executeUpdateOne, executeDeleteOne, executeAggregate, findAllcollections } from "./db/mongodb.tool.js";
// import { connectToDatabase, closeConnection } from "./db/mongodb.js";

// const server = new McpServer({
//     name: "example-server",
//     version: "1.0.0"
// });

// // ... set up server resources, tools, and prompts ...

// const app = express();


// server.tool(
//     "addTwoNumbers",
//     "Add two numbers",
//     {
//         a: z.number(),
//         b: z.number()
//     },
//     async (arg) => {
//         const { a, b } = arg;
//         return {
//             content: [
//                 {
//                     type: "text",
//                     text: `The sum of ${a} and ${b} is ${a + b}`
//                 }
//             ]
//         }
//     }
// )



// server.tool(
//     "findAllcollections",

//     "Find all collections in a MongoDB database",
//     async () => {
//         return findAllcollections();

//     }
// );



// // MongoDB tools
// server.tool(
//     "findDocuments",
//     "Find documents in a MongoDB collection",
//     {
//         collection: z.string(),
//         query: z.any().optional(),
//         options: z.any().optional()
//     },
//     async (arg) => {
//         const { collection, query, options } = arg;
//         return executeFind(collection, query || {}, options || {});
//     }
// );

// server.tool(
//     "insertDocument",
//     "Insert a document into a MongoDB collection",
//     {
//         collection: z.string(),
//         document: z.any()
//     },
//     async (arg) => {
//         const { collection, document } = arg;
//         return executeInsertOne(collection, document);
//     }
// );

// server.tool(
//     "updateDocument",
//     "Update a document in a MongoDB collection",
//     {
//         collection: z.string(),
//         filter: z.any(),
//         update: z.any()
//     },
//     async (arg) => {
//         const { collection, filter, update } = arg;
//         return executeUpdateOne(collection, filter, update);
//     }
// );

// server.tool(
//     "deleteDocument",
//     "Delete a document from a MongoDB collection",
//     {
//         collection: z.string(),
//         filter: z.any()
//     },
//     async (arg) => {
//         const { collection, filter } = arg;
//         return executeDeleteOne(collection, filter);
//     }
// );

// // server.tool(
// //     "aggregateDocuments",
// //     "Execute an aggregation pipeline on a MongoDB collection",
// //     {
// //         collection: z.string(),
// //         pipeline: z.array(z.object({
// //             stage: z.string().describe("The aggregation stage name (e.g., $match, $group, $sort)"),
// //             params: z.any().describe("The parameters for this aggregation stage")
// //         }))
// //     },
// //     async (arg) => {
// //         const { collection, pipeline } = arg;
// //         // Convert the simplified pipeline format to MongoDB's format
// //         const mongoDbPipeline = pipeline.map(stage => {
// //             const { stage: stageName, params } = stage;
// //             return { [stageName]: params };
// //         });
// //         return executeAggregate(collection, mongoDbPipeline);
// //     }
// // );

// // server.tool(
// //     "createPost",
// //     "Create a post on X formally known as Twitter ", {
// //     status: z.string()
// // }, async (arg) => {
// //     const { status } = arg;
// //     return createPost(status);
// // })


// // to support multiple simultaneous connections we have a lookup object from
// // sessionId to transport
// const transports = {};

// app.get("/sse", async (req, res) => {
//     const transport = new SSEServerTransport('/messages', res);
//     transports[ transport.sessionId ] = transport;
//     res.on("close", () => {
//         delete transports[ transport.sessionId ];
//     });
//     await server.connect(transport);
// });

// app.post("/messages", async (req, res) => {
//     const sessionId = req.query.sessionId;
//     const transport = transports[ sessionId ];

//     console.log("------------------------------------");
//     console.log( sessionId );
//     console.log("------------------------------------");
    
    

//     if (transport) {
//         await transport.handlePostMessage(req, res);
//     } else {
//         res.status(400).send(` No transport found for sessionId ${sessionId}` ,);
//     }
// });

// // Connect to MongoDB when the server starts
// connectToDatabase()
//     .then(() => {
//         console.log("MongoDB connected successfully");
//     })
//     .catch(err => {
//         console.error("Failed to connect to MongoDB:", err);
//     });

// // Close MongoDB connection when the server shuts down
// process.on('SIGINT', async () => {
//     await closeConnection();
//     process.exit(0);
// });

// app.listen(3001, () => {
//     console.log("Server is running on http://localhost:3001");
// });



import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import { executeFind, executeInsertOne, executeUpdateOne, executeDeleteOne, executeAggregate, findAllcollections } from "./db/mongodb.tool.js";
import { connectToDatabase, closeConnection } from "./db/mongodb.js";

const server = new McpServer({
    name: "example-server",
    version: "1.0.0"
});

const app = express();

// Add Express trust proxy for correct IP detection
app.set('trust proxy', true);

// Enhanced transport management with connection rate limiting and circuit breaker
const transports = new Map();
const connectionAttempts = new Map(); // Track connection attempts per IP
const circuitBreaker = { failures: 0, lastFailure: 0, isOpen: false };
const TRANSPORT_TIMEOUT = 300000; // 5 minutes
const HEARTBEAT_INTERVAL = 30000; // 30 seconds
const MAX_CONNECTIONS_PER_IP = 3;
const CONNECTION_RATE_LIMIT = 5000; // 5 seconds between connections from same IP
const CIRCUIT_BREAKER_THRESHOLD = 10;
const CIRCUIT_BREAKER_TIMEOUT = 60000; // 1 minute

// Circuit breaker functions
const recordFailure = () => {
    circuitBreaker.failures++;
    circuitBreaker.lastFailure = Date.now();
    
    if (circuitBreaker.failures >= CIRCUIT_BREAKER_THRESHOLD) {
        circuitBreaker.isOpen = true;
        console.log(`🚨 Circuit breaker opened after ${circuitBreaker.failures} failures`);
        
        // Auto-reset circuit breaker after timeout
        setTimeout(() => {
            console.log('🔄 Circuit breaker reset attempt');
            circuitBreaker.isOpen = false;
            circuitBreaker.failures = 0;
        }, CIRCUIT_BREAKER_TIMEOUT);
    }
};

const recordSuccess = () => {
    circuitBreaker.failures = 0;
    circuitBreaker.isOpen = false;
};

const isCircuitOpen = () => {
    return circuitBreaker.isOpen;
};

// Rate limiting for connections
const isRateLimited = (ip) => {
    const now = Date.now();
    const attempts = connectionAttempts.get(ip) || [];
    
    // Clean old attempts (older than rate limit window)
    const recentAttempts = attempts.filter(time => now - time < CONNECTION_RATE_LIMIT);
    
    if (recentAttempts.length >= MAX_CONNECTIONS_PER_IP) {
        return true;
    }
    
    recentAttempts.push(now);
    connectionAttempts.set(ip, recentAttempts);
    return false;
};

// Add transport monitoring
const addTransport = (transport) => {
    transports.set(transport.sessionId, {
        transport,
        lastActivity: Date.now(),
        heartbeatTimer: null
    });
    
    // Set up heartbeat
    const heartbeat = setInterval(() => {
        const transportData = transports.get(transport.sessionId);
        if (transportData && Date.now() - transportData.lastActivity > TRANSPORT_TIMEOUT) {
            console.log(`Cleaning up inactive transport: ${transport.sessionId}`);
            clearTransport(transport.sessionId);
        }
    }, HEARTBEAT_INTERVAL);
    
    transports.get(transport.sessionId).heartbeatTimer = heartbeat;
    
    console.log(`Transport added: ${transport.sessionId}. Active transports: ${transports.size}`);
};

const clearTransport = (sessionId) => {
    const transportData = transports.get(sessionId);
    if (transportData) {
        if (transportData.heartbeatTimer) {
            clearInterval(transportData.heartbeatTimer);
        }
        transports.delete(sessionId);
        console.log(`Transport removed: ${sessionId}. Active transports: ${transports.size}`);
    }
};

const updateTransportActivity = (sessionId) => {
    const transportData = transports.get(sessionId);
    if (transportData) {
        transportData.lastActivity = Date.now();
    }
};

// Your existing tools
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
        };
    }
);

server.tool(
    "findAllcollections",
    "Find all collections in a MongoDB database",
    {},
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

// Fixed SSE endpoint with comprehensive protection
app.get("/sse", async (req, res) => {
    let transport = null;
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    
    try {
        // Circuit breaker check
        if (isCircuitOpen()) {
            console.log(`Circuit breaker is open, rejecting connection from ${clientIP}`);
            if (!res.headersSent) {
                return res.status(503).json({ 
                    error: 'Service temporarily unavailable due to repeated failures',
                    retryAfter: CIRCUIT_BREAKER_TIMEOUT / 1000
                });
            }
            return;
        }
        
        // Rate limiting check
        if (isRateLimited(clientIP)) {
            console.log(`Rate limited connection from IP: ${clientIP}`);
            if (!res.headersSent) {
                return res.status(429).json({ 
                    error: 'Too many connection attempts. Please wait before retrying.',
                    retryAfter: CONNECTION_RATE_LIMIT / 1000
                });
            }
            return;
        }
        
        // Connection limit check
        if (transports.size >= 100) {
            console.log('Maximum concurrent connections reached');
            if (!res.headersSent) {
                return res.status(503).json({ 
                    error: 'Server at maximum capacity. Please try again later.'
                });
            }
            return;
        }
        
        console.log(`New SSE connection request from IP: ${clientIP}`);
        
        // Check if response is already closed/invalid
        if (res.headersSent || res.destroyed || !res.writable) {
            console.log('Response already closed or not writable, aborting SSE setup');
            return;
        }

        // Create transport - it will handle setting SSE headers
        transport = new SSEServerTransport('/messages', res);
        
        // Set up cleanup handlers
        const cleanup = () => {
            if (transport && transports.has(transport.sessionId)) {
                console.log(`Cleaning up transport: ${transport.sessionId}`);
                clearTransport(transport.sessionId);
            }
        };

        req.on('close', cleanup);
        req.on('error', (err) => {
            if (err.code !== 'ECONNRESET' && err.code !== 'ECONNABORTED') {
                console.error(`SSE request error for ${transport?.sessionId}:`, err.code);
                recordFailure();
            }
            cleanup();
        });

        res.on('close', cleanup);
        res.on('error', (err) => {
            if (err.code !== 'ECONNRESET' && err.code !== 'ECONNABORTED') {
                console.error(`SSE response error for ${transport?.sessionId}:`, err.code);
                recordFailure();
            }
            cleanup();
        });

        // Add to transports management
        addTransport(transport);

        // Connect server to transport
        await server.connect(transport);
        
        recordSuccess(); // Record successful connection
        console.log(`SSE connection established: ${transport.sessionId}`);
        
    } catch (error) {
        console.error('Error establishing SSE connection:', error.message);
        recordFailure();
        
        // Clean up transport if it was created
        if (transport && transport.sessionId) {
            clearTransport(transport.sessionId);
        }
        
        // Only send error response if headers haven't been sent
        if (!res.headersSent && !res.destroyed && res.writable) {
            try {
                res.status(500).json({ 
                    error: 'Failed to establish SSE connection',
                    code: error.code || 'INTERNAL_ERROR'
                });
            } catch (responseError) {
                console.error('Error sending error response:', responseError.message);
                // Force close the response if we can't send error
                try {
                    res.destroy();
                } catch (destroyError) {
                    // Ignore destroy errors
                }
            }
        }
    }
});

// Enhanced message handling with validation and fallback
app.post("/messages", async (req, res) => {
    const sessionId = req.query.sessionId;
    
    if (!sessionId) {
        return res.status(400).json({ 
            error: "Missing sessionId parameter" 
        });
    }

    console.log(`Message request for session: ${sessionId}`);
    console.log(`Active transports: ${Array.from(transports.keys()).join(', ')}`);

    const transportData = transports.get(sessionId);

    if (!transportData) {
        console.error(`No transport found for sessionId: ${sessionId}`);
        
        // Provide helpful error response
        return res.status(400).json({
            error: `No transport found for sessionId ${sessionId}`,
            suggestion: "Please establish a new SSE connection at /sse endpoint",
            activeTransports: transports.size,
            debug: {
                requestedSession: sessionId,
                activeSessions: Array.from(transports.keys())
            }
        });
    }

    try {
        updateTransportActivity(sessionId);
        await transportData.transport.handlePostMessage(req, res);
    } catch (error) {
        console.error(`Error handling message for session ${sessionId}:`, error);
        
        // Clean up potentially corrupted transport
        clearTransport(sessionId);
        
        res.status(500).json({
            error: "Internal server error while processing message",
            sessionId: sessionId
        });
    }
});

// Health check endpoint with circuit breaker status
app.get("/health", (req, res) => {
    res.json({
        status: circuitBreaker.isOpen ? "degraded" : "healthy",
        activeTransports: transports.size,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        circuitBreaker: {
            isOpen: circuitBreaker.isOpen,
            failures: circuitBreaker.failures,
            lastFailure: circuitBreaker.lastFailure ? new Date(circuitBreaker.lastFailure).toISOString() : null
        }
    });
});

// Debug endpoint to see active transports
app.get("/debug/transports", (req, res) => {
    const transportInfo = Array.from(transports.entries()).map(([sessionId, data]) => ({
        sessionId,
        lastActivity: new Date(data.lastActivity).toISOString(),
        age: Date.now() - data.lastActivity
    }));
    
    res.json({
        count: transports.size,
        transports: transportInfo
    });
});

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
    console.log(`Received ${signal}. Starting graceful shutdown...`);
    
    // Close all active transports
    for (const [sessionId, transportData] of transports.entries()) {
        if (transportData.heartbeatTimer) {
            clearInterval(transportData.heartbeatTimer);
        }
    }
    transports.clear();
    
    // Close MongoDB connection
    try {
        await closeConnection();
        console.log("MongoDB connection closed");
    } catch (err) {
        console.error("Error closing MongoDB connection:", err);
    }
    
    process.exit(0);
};

// Connect to MongoDB when the server starts
connectToDatabase()
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch(err => {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    });

// Handle different shutdown signals
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGHUP', () => gracefulShutdown('SIGHUP'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
    console.log(`Debug transports at http://localhost:${PORT}/debug/transports`);
});