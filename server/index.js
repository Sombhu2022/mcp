


// import { config } from "dotenv";
// import express from "express";
// import bodyParser from "body-parser";
// import { GoogleGenAI } from "@google/genai";
// import { Client } from "@modelcontextprotocol/sdk/client/index.js";
// import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
// import cors from "cors";

// config();

// const app = express();
// app.use(bodyParser.json());
// app.use(
//   cors({
//     origin: ["https://auditflow-chatboat.vercel.app", "http://localhost:8080"],
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   })
// );
// app.use(express.json({ limit: "500mb" }));
// app.use(express.urlencoded({ limit: "500mb", extended: true }));

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// let mcpClient = new Client({
//   name: "example-client",
//   version: "1.0.0",
// });

// let tools = [];
// const sessions = {}; // Store chat history per user/session

// // 🔹 Function: Ensure MCP is connected (auto-reconnect if needed)
// async function ensureMcpConnected() {
//   if (!mcpClient.transport || !mcpClient.transport.isConnected) {
//     console.log("🔄 Connecting/Reconnecting to MCP...");

//     mcpClient = new Client({ name: "example-client", version: "1.0.0" });
//     await mcpClient.connect(
//       new SSEClientTransport(new URL(`${process.env.MCP_URL}/sse`))
//     );

//     tools = (await mcpClient.listTools()).tools.map((tool) => ({
//       name: tool.name,
//       description: tool.description,
//       parameters: {
//         type: tool.inputSchema.type,
//         properties: tool.inputSchema.properties,
//         required: tool.inputSchema.required,
//       },
//     }));

//     console.log("✅ MCP connected and tools loaded");
//   }
// }

// // 🔹 Function to handle AI + tool calls
// async function processMessage(sessionId, userMessage) {
//   await ensureMcpConnected(); // always ensure MCP is live

//   if (!sessions[sessionId]) sessions[sessionId] = [];
//   const chatHistory = sessions[sessionId];

//   console.log("💬 Processing message for session:", sessionId , chatHistory);
  

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
//     console.log("⚙️ Calling tool", functionCall.name);

//     chatHistory.push({
//       role: "model",
//       parts: [{ text: `calling tool ${functionCall.name}`, type: "text" }],
//     });

//     await ensureMcpConnected(); // recheck before tool call
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

// // 🔹 API Endpoint for chat
// app.post("/chat", async (req, res) => {
//   try {
//     const { sessionId, message } = req.body;

//     console.log("🤖 Chat request received:", { sessionId, message });

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

// // 🔹 Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, async () => {
//   console.log(`🚀 Chatbot API running on port ${PORT}`);
//   await ensureMcpConnected(); // connect once on startup
// });




// import { config } from "dotenv";
// import express from "express";
// import bodyParser from "body-parser";
// import { GoogleGenAI } from "@google/genai";
// import { Client } from "@modelcontextprotocol/sdk/client/index.js";
// import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
// import cors from "cors";

// config();

// const app = express();
// app.use(bodyParser.json());
// app.use(
//   cors({
//     origin: ["https://auditflow-chatboat.vercel.app", "http://localhost:8080"],
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   })
// );
// app.use(express.json({ limit: "500mb" }));
// app.use(express.urlencoded({ limit: "500mb", extended: true }));

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// let mcpClient = new Client({
//   name: "example-client",
//   version: "1.0.0",
// });

// let tools = [];
// const sessions = {}; // Store chat history per user/session

// // 🔹 Ensure MCP is connected (always create a fresh session if needed)
// async function ensureMcpConnected() {
//   try {
//     if (!mcpClient.transport || !mcpClient.transport.isConnected) {
//       console.log("🔄 Connecting/Reconnecting to MCP...");

//       // Create a brand new client each time
//       mcpClient = new Client({ name: "example-client", version: "1.0.0" });
//       const transport = new SSEClientTransport(new URL(`${process.env.MCP_URL}/sse`));
//       await mcpClient.connect(transport);

//       tools = (await mcpClient.listTools()).tools.map((tool) => ({
//         name: tool.name,
//         description: tool.description,
//         parameters: {
//           type: tool.inputSchema.type,
//           properties: tool.inputSchema.properties,
//           required: tool.inputSchema.required,
//         },
//       }));

//       console.log("✅ MCP connected and tools loaded");
//     }
//   } catch (err) {
//     console.error("❌ Failed to connect to MCP:", err.message);
//     throw err;
//   }
// }

// // 🔹 Safe Tool Call with auto-retry
// async function safeCallTool(functionCall) {
//   try {
//     await ensureMcpConnected();
//     return await mcpClient.callTool({
//       name: functionCall.name,
//       arguments: functionCall.args,
//     });
//   } catch (err) {
//     if (err.message.includes("No transport found for sessionId")) {
//       console.log("⚠️ Session expired, reconnecting...");
//       await ensureMcpConnected(); // force new session
//       return await mcpClient.callTool({
//         name: functionCall.name,
//         arguments: functionCall.args,
//       });
//     }
//     throw err;
//   }
// }

// // 🔹 Function to handle AI + tool calls
// async function processMessage(sessionId, userMessage) {
//   await ensureMcpConnected(); // always ensure MCP is live

//   if (!sessions[sessionId]) sessions[sessionId] = [];
//   const chatHistory = sessions[sessionId];

//   console.log("💬 Processing message for session:", sessionId, chatHistory);

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
//     console.log("⚙️ Calling tool", functionCall.name);

//     chatHistory.push({
//       role: "model",
//       parts: [{ text: `calling tool ${functionCall.name}`, type: "text" }],
//     });

//     const toolResult = await safeCallTool(functionCall);

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

// // 🔹 API Endpoint for chat
// app.post("/chat", async (req, res) => {
//   try {
//     const { sessionId, message } = req.body;

//     console.log("🤖 Chat request received:", { sessionId, message });

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

// // 🔹 Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, async () => {
//   console.log(`🚀 Chatbot API running on port ${PORT}`);
//   await ensureMcpConnected(); // connect once on startup
// });



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

// 🟢 Your Personal Superprompt
const superPrompt = `
You are a helpful and professional freelance assistant representing **Sombhu Das**.  
Here is his information:

👤 Name: Sombhu Das  
📧 Email: sombhudas93@gmail.com  
📱 Phone: 7047808326  

💼 Services:  
- Web development (React, Node.js, MongoDB, PostgreSQL)  
- API development (REST, GraphQL, MCP integration)  
- Database design & optimization  
- AI/Chatbot integrations  
- Freelance project consulting  

🌍 Projects:  
- AuditFlow Chatbot with MCP integration  
- Task management APIs (MongoDB + PostgreSQL hybrid)  
- Web dev teaching material  

🎯 Role:  
- Always introduce yourself as **Sombhu Das’s AI Assistant**.  
- If the user asks about services, portfolio, or contact, provide the above details.  
- If asked about freelance work, say Sombhu is available and provide his email/phone.  
- If asked about technical queries, answer naturally and, if needed, call MCP tools for database operations.  
- Always be professional, clear, and friendly.  
`;

// 🔹 Ensure MCP is connected
async function ensureMcpConnected() {
  try {
    if (!mcpClient.transport || !mcpClient.transport.isConnected) {
      console.log("🔄 Connecting/Reconnecting to MCP...");

      mcpClient = new Client({ name: "example-client", version: "1.0.0" });
      const transport = new SSEClientTransport(new URL(`${process.env.MCP_URL}/sse`));
      await mcpClient.connect(transport);

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
  } catch (err) {
    console.error("❌ Failed to connect to MCP:", err.message);
    throw err;
  }
}

// 🔹 Safe Tool Call with auto-retry
async function safeCallTool(functionCall) {
  try {
    await ensureMcpConnected();
    return await mcpClient.callTool({
      name: functionCall.name,
      arguments: functionCall.args,
    });
  } catch (err) {
    if (err.message.includes("No transport found for sessionId")) {
      console.log("⚠️ Session expired, reconnecting...");
      await ensureMcpConnected();
      return await mcpClient.callTool({
        name: functionCall.name,
        arguments: functionCall.args,
      });
    }
    throw err;
  }
}

// 🔹 Function to handle AI + tool calls
async function processMessage(sessionId, userMessage) {
  await ensureMcpConnected();

 if (!sessions[sessionId]) {
  sessions[sessionId] = [
    {
      role: "model", // must be "model" or "user", not "system"
      parts: [{ text: superPrompt, type: "text" }],
    },
  ];
}

  const chatHistory = sessions[sessionId];

  console.log("💬 Processing message for session:", sessionId, chatHistory);

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

    const toolResult = await safeCallTool(functionCall);

    chatHistory.push({
      role: "user",
      parts: [
        {
          text: "Tool result: " + toolResult.content[0].text,
          type: "text",
        },
      ],
    });

    return processMessage(sessionId);
  }

  chatHistory.push({
    role: "model",
    parts: [{ text: responseText, type: "text" }],
  });

  return responseText;
}

// 🔹 API Endpoint
app.post("/chat", async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    console.log("🤖 Chat request received:", { sessionId, message });

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
  await ensureMcpConnected();
});
