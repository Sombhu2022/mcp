


// import { config } from "dotenv";
// import express from "express";
// import bodyParser from "body-parser";
// import { GoogleGenAI } from "@google/genai";
// import { Client } from "@modelcontextprotocol/sdk/client/index.js";
// import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
// import cors from "cors"

// config();

// const app = express();
// app.use(bodyParser.json());
// app.use(
//   cors(
//     {
//     origin:[ "https://auditflow-chatboat.vercel.app" , "http://localhost:8080" ], // Allow all origins
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow specific methods
    
//   }
// )
// );
// app.use(express.json({ limit: "500mb" }));
// app.use(express.urlencoded({ limit: "500mb", extended: true }));



// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// const mcpClient = new Client({
//   name: "example-client",
//   version: "1.0.0",
// });

// let tools = [];
// const sessions = {}; // Store chat history per user/session

// // Connect to MCP server once
// await mcpClient.connect(
//   new SSEClientTransport(new URL(`${process.env.MCP_URL}/sse`))
// );
// console.log("Connected to MCP server");

// tools = (await mcpClient.listTools()).tools.map((tool) => ({
//   name: tool.name,
//   description: tool.description,
//   parameters: {
//     type: tool.inputSchema.type,
//     properties: tool.inputSchema.properties,
//     required: tool.inputSchema.required,
//   },
// }));

// // Function to handle AI + tool calls
// async function processMessage(sessionId, userMessage) {
//   if (!sessions[sessionId]) sessions[sessionId] = [];

//   const chatHistory = sessions[sessionId];

//   if (userMessage) {
//     chatHistory.push({
//       role: "user",
//       parts: [{ text: userMessage, type: "text" }],
//     });
//   }

//   const response = await ai.models.generateContent({
//     model: "gemini-2.0-flash",
//     contents: chatHistory,
//     config: { tools: [{ functionDeclarations: tools }] },
//   });

//   const candidate = response.candidates[0].content.parts[0];
//   const functionCall = candidate.functionCall;
//   const responseText = candidate.text;

//   if (functionCall) {
//     console.log("Calling tool", functionCall.name);

//     chatHistory.push({
//       role: "model",
//       parts: [{ text: `calling tool ${functionCall.name}`, type: "text" }],
//     });

//     const toolResult = await mcpClient.callTool({
//       name: functionCall.name,
//       arguments: functionCall.args,
//     });

//     chatHistory.push({
//       role: "user",
//       parts: [
//         {
//           text: "Tool result: " + toolResult.content[0].text,
//           type: "text",
//         },
//       ],
//     });

//     // Recursive process after tool result
//     return processMessage(sessionId);
//   }

//   // Save and return final AI text
//   chatHistory.push({
//     role: "model",
//     parts: [{ text: responseText, type: "text" }],
//   });

//   return responseText;
// }

// // API Endpoint for chat
// app.post("/chat", async (req, res) => {
//   try {
//     const { sessionId, message } = req.body;

//     if (!sessionId) {
//       return res.status(400).json({ error: "sessionId is required" });
//     }

//     const reply = await processMessage(sessionId, message);
//     res.status(200).json({ reply });

//   } catch (err) {
//     console.error("Chat error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 Chatbot API running on port ${PORT}`));




import { config } from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import { GoogleGenAI } from "@google/genai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import cors from "cors";

config();

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["https://auditflow-chatboat.vercel.app", "http://localhost:8080"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
let mcpClient = new Client({
  name: "example-client",
  version: "1.0.0",
});

let tools = [];
const sessions = {}; // Store chat history per user/session

// 🔹 Function: Ensure MCP is connected (auto-reconnect if needed)
async function ensureMcpConnected() {
  if (!mcpClient.transport || !mcpClient.transport.isConnected) {
    console.log("🔄 Connecting/Reconnecting to MCP...");

    mcpClient = new Client({ name: "example-client", version: "1.0.0" });
    await mcpClient.connect(
      new SSEClientTransport(new URL(`${process.env.MCP_URL}/sse`))
    );

    tools = (await mcpClient.listTools()).tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: {
        type: tool.inputSchema.type,
        properties: tool.inputSchema.properties,
        required: tool.inputSchema.required,
      },
    }));

    console.log("✅ MCP connected and tools loaded");
  }
}

// 🔹 Function to handle AI + tool calls
async function processMessage(sessionId, userMessage) {
  await ensureMcpConnected(); // always ensure MCP is live

  if (!sessions[sessionId]) sessions[sessionId] = [];
  const chatHistory = sessions[sessionId];

  if (userMessage) {
    chatHistory.push({
      role: "user",
      parts: [{ text: userMessage, type: "text" }],
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: chatHistory,
    config: { tools: [{ functionDeclarations: tools }] },
  });

  const candidate = response.candidates[0].content.parts[0];
  const functionCall = candidate.functionCall;
  const responseText = candidate.text;

  if (functionCall) {
    console.log("⚙️ Calling tool", functionCall.name);

    chatHistory.push({
      role: "model",
      parts: [{ text: `calling tool ${functionCall.name}`, type: "text" }],
    });

    await ensureMcpConnected(); // recheck before tool call
    const toolResult = await mcpClient.callTool({
      name: functionCall.name,
      arguments: functionCall.args,
    });

    chatHistory.push({
      role: "user",
      parts: [
        {
          text: "Tool result: " + toolResult.content[0].text,
          type: "text",
        },
      ],
    });

    // Recursive process after tool result
    return processMessage(sessionId);
  }

  // Save and return final AI text
  chatHistory.push({
    role: "model",
    parts: [{ text: responseText, type: "text" }],
  });

  return responseText;
}

// 🔹 API Endpoint for chat
app.post("/chat", async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }

    const reply = await processMessage(sessionId, message);
    res.status(200).json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Chatbot API running on port ${PORT}`);
  await ensureMcpConnected(); // connect once on startup
});
