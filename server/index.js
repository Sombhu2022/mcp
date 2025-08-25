


// // import { config } from "dotenv";
// // import express from "express";
// // import bodyParser from "body-parser";
// // import { GoogleGenAI } from "@google/genai";
// // import { Client } from "@modelcontextprotocol/sdk/client/index.js";
// // import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
// // import cors from "cors";

// // config();

// // const app = express();
// // app.use(bodyParser.json());
// // app.use(
// //   cors({
// //     origin: ["https://auditflow-chatboat.vercel.app", "http://localhost:8080"],
// //     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// //   })
// // );
// // app.use(express.json({ limit: "500mb" }));
// // app.use(express.urlencoded({ limit: "500mb", extended: true }));

// // const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// // let mcpClient = new Client({
// //   name: "example-client",
// //   version: "1.0.0",
// // });

// // let tools = [];
// // const sessions = {}; // Store chat history per user/session

// // // 🔹 Function: Ensure MCP is connected (auto-reconnect if needed)
// // async function ensureMcpConnected() {
// //   if (!mcpClient.transport || !mcpClient.transport.isConnected) {
// //     console.log("🔄 Connecting/Reconnecting to MCP...");

// //     mcpClient = new Client({ name: "example-client", version: "1.0.0" });
// //     await mcpClient.connect(
// //       new SSEClientTransport(new URL(`${process.env.MCP_URL}/sse`))
// //     );

// //     tools = (await mcpClient.listTools()).tools.map((tool) => ({
// //       name: tool.name,
// //       description: tool.description,
// //       parameters: {
// //         type: tool.inputSchema.type,
// //         properties: tool.inputSchema.properties,
// //         required: tool.inputSchema.required,
// //       },
// //     }));

// //     console.log("✅ MCP connected and tools loaded");
// //   }
// // }

// // // 🔹 Function to handle AI + tool calls
// // async function processMessage(sessionId, userMessage) {
// //   await ensureMcpConnected(); // always ensure MCP is live

// //   if (!sessions[sessionId]) sessions[sessionId] = [];
// //   const chatHistory = sessions[sessionId];

// //   console.log("💬 Processing message for session:", sessionId , chatHistory);
  

// //   if (userMessage) {
// //     chatHistory.push({
// //       role: "user",
// //       parts: [{ text: userMessage, type: "text" }],
// //     });
// //   }

// //   const response = await ai.models.generateContent({
// //     model: "gemini-2.0-flash",
// //     contents: chatHistory,
// //     config: { tools: [{ functionDeclarations: tools }] },
// //   });

// //   const candidate = response.candidates[0].content.parts[0];
// //   const functionCall = candidate.functionCall;
// //   const responseText = candidate.text;

// //   if (functionCall) {
// //     console.log("⚙️ Calling tool", functionCall.name);

// //     chatHistory.push({
// //       role: "model",
// //       parts: [{ text: `calling tool ${functionCall.name}`, type: "text" }],
// //     });

// //     await ensureMcpConnected(); // recheck before tool call
// //     const toolResult = await mcpClient.callTool({
// //       name: functionCall.name,
// //       arguments: functionCall.args,
// //     });

// //     chatHistory.push({
// //       role: "user",
// //       parts: [
// //         {
// //           text: "Tool result: " + toolResult.content[0].text,
// //           type: "text",
// //         },
// //       ],
// //     });

// //     // Recursive process after tool result
// //     return processMessage(sessionId);
// //   }

// //   // Save and return final AI text
// //   chatHistory.push({
// //     role: "model",
// //     parts: [{ text: responseText, type: "text" }],
// //   });

// //   return responseText;
// // }

// // // 🔹 API Endpoint for chat
// // app.post("/chat", async (req, res) => {
// //   try {
// //     const { sessionId, message } = req.body;

// //     console.log("🤖 Chat request received:", { sessionId, message });

// //     if (!sessionId) {
// //       return res.status(400).json({ error: "sessionId is required" });
// //     }

// //     const reply = await processMessage(sessionId, message);
// //     res.status(200).json({ reply });
// //   } catch (err) {
// //     console.error("Chat error:", err);
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // 🔹 Start server
// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, async () => {
// //   console.log(`🚀 Chatbot API running on port ${PORT}`);
// //   await ensureMcpConnected(); // connect once on startup
// // });




// // import { config } from "dotenv";
// // import express from "express";
// // import bodyParser from "body-parser";
// // import { GoogleGenAI } from "@google/genai";
// // import { Client } from "@modelcontextprotocol/sdk/client/index.js";
// // import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
// // import cors from "cors";

// // config();

// // const app = express();
// // app.use(bodyParser.json());
// // app.use(
// //   cors({
// //     origin: ["https://auditflow-chatboat.vercel.app", "http://localhost:8080"],
// //     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// //   })
// // );
// // app.use(express.json({ limit: "500mb" }));
// // app.use(express.urlencoded({ limit: "500mb", extended: true }));

// // const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// // let mcpClient = new Client({
// //   name: "example-client",
// //   version: "1.0.0",
// // });

// // let tools = [];
// // const sessions = {}; // Store chat history per user/session

// // // 🔹 Ensure MCP is connected (always create a fresh session if needed)
// // async function ensureMcpConnected() {
// //   try {
// //     if (!mcpClient.transport || !mcpClient.transport.isConnected) {
// //       console.log("🔄 Connecting/Reconnecting to MCP...");

// //       // Create a brand new client each time
// //       mcpClient = new Client({ name: "example-client", version: "1.0.0" });
// //       const transport = new SSEClientTransport(new URL(`${process.env.MCP_URL}/sse`));
// //       await mcpClient.connect(transport);

// //       tools = (await mcpClient.listTools()).tools.map((tool) => ({
// //         name: tool.name,
// //         description: tool.description,
// //         parameters: {
// //           type: tool.inputSchema.type,
// //           properties: tool.inputSchema.properties,
// //           required: tool.inputSchema.required,
// //         },
// //       }));

// //       console.log("✅ MCP connected and tools loaded");
// //     }
// //   } catch (err) {
// //     console.error("❌ Failed to connect to MCP:", err.message);
// //     throw err;
// //   }
// // }

// // // 🔹 Safe Tool Call with auto-retry
// // async function safeCallTool(functionCall) {
// //   try {
// //     await ensureMcpConnected();
// //     return await mcpClient.callTool({
// //       name: functionCall.name,
// //       arguments: functionCall.args,
// //     });
// //   } catch (err) {
// //     if (err.message.includes("No transport found for sessionId")) {
// //       console.log("⚠️ Session expired, reconnecting...");
// //       await ensureMcpConnected(); // force new session
// //       return await mcpClient.callTool({
// //         name: functionCall.name,
// //         arguments: functionCall.args,
// //       });
// //     }
// //     throw err;
// //   }
// // }

// // // 🔹 Function to handle AI + tool calls
// // async function processMessage(sessionId, userMessage) {
// //   await ensureMcpConnected(); // always ensure MCP is live

// //   if (!sessions[sessionId]) sessions[sessionId] = [];
// //   const chatHistory = sessions[sessionId];

// //   console.log("💬 Processing message for session:", sessionId, chatHistory);

// //   if (userMessage) {
// //     chatHistory.push({
// //       role: "user",
// //       parts: [{ text: userMessage, type: "text" }],
// //     });
// //   }

// //   const response = await ai.models.generateContent({
// //     model: "gemini-2.0-flash",
// //     contents: chatHistory,
// //     config: { tools: [{ functionDeclarations: tools }] },
// //   });

// //   const candidate = response.candidates[0].content.parts[0];
// //   const functionCall = candidate.functionCall;
// //   const responseText = candidate.text;

// //   if (functionCall) {
// //     console.log("⚙️ Calling tool", functionCall.name);

// //     chatHistory.push({
// //       role: "model",
// //       parts: [{ text: `calling tool ${functionCall.name}`, type: "text" }],
// //     });

// //     const toolResult = await safeCallTool(functionCall);

// //     chatHistory.push({
// //       role: "user",
// //       parts: [
// //         {
// //           text: "Tool result: " + toolResult.content[0].text,
// //           type: "text",
// //         },
// //       ],
// //     });

// //     // Recursive process after tool result
// //     return processMessage(sessionId);
// //   }

// //   // Save and return final AI text
// //   chatHistory.push({
// //     role: "model",
// //     parts: [{ text: responseText, type: "text" }],
// //   });

// //   return responseText;
// // }

// // // 🔹 API Endpoint for chat
// // app.post("/chat", async (req, res) => {
// //   try {
// //     const { sessionId, message } = req.body;

// //     console.log("🤖 Chat request received:", { sessionId, message });

// //     if (!sessionId) {
// //       return res.status(400).json({ error: "sessionId is required" });
// //     }

// //     const reply = await processMessage(sessionId, message);
// //     res.status(200).json({ reply });
// //   } catch (err) {
// //     console.error("Chat error:", err);
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // 🔹 Start server
// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, async () => {
// //   console.log(`🚀 Chatbot API running on port ${PORT}`);
// //   await ensureMcpConnected(); // connect once on startup
// // });



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

// // 🟢 Your Personal Superprompt
// const superPrompt = `
// You are a helpful and professional freelance assistant representing **Sombhu Das**.  
// Here is his information:

// 👤 Name: Sombhu Das  
// 📧 Email: sombhudas93@gmail.com  
// 📱 Phone: 7047808326  

// 💼 Services:  
// - Web development (React, Node.js, MongoDB, PostgreSQL)  
// - API development (REST, GraphQL, MCP integration)  
// - Database design & optimization  
// - AI/Chatbot integrations  
// - Freelance project consulting  

// 🌍 Projects:  
// - AuditFlow Chatbot with MCP integration  
// - Task management APIs (MongoDB + PostgreSQL hybrid)  
// - Web dev teaching material  

// 🎯 Role:  
// - Always introduce yourself as **Sombhu Das’s AI Assistant**.  
// - If the user asks about services, portfolio, or contact, provide the above details.  
// - If asked about freelance work, say Sombhu is available and provide his email/phone.  
// - If asked about technical queries, answer naturally and, if needed, call MCP tools for database operations.  
// - Always be professional, clear, and friendly.  
// `;

// // 🔹 Ensure MCP is connected
// async function ensureMcpConnected() {
//   try {
//     if (!mcpClient.transport || !mcpClient.transport.isConnected) {
//       console.log("🔄 Connecting/Reconnecting to MCP...");

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
//       await ensureMcpConnected();
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
//   await ensureMcpConnected();

//  if (!sessions[sessionId]) {
//   sessions[sessionId] = [
//     {
//       role: "model", // must be "model" or "user", not "system"
//       parts: [{ text: superPrompt, type: "text" }],
//     },
//   ];
// }

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

//     return processMessage(sessionId);
//   }

//   chatHistory.push({
//     role: "model",
//     parts: [{ text: responseText, type: "text" }],
//   });

//   return responseText;
// }

// // 🔹 API Endpoint
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
//   await ensureMcpConnected();
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

// Enhanced MCP connection management
class MCPConnectionManager {
  constructor() {
    this.client = null;
    this.transport = null;
    this.tools = [];
    this.isConnecting = false;
    this.connectionAttempts = 0;
    this.maxRetries = 3;
    this.retryDelay = 2000; // 2 seconds
    this.healthCheckInterval = null;
  }

  async connect() {
    if (this.isConnecting) {
      console.log("⏳ Connection already in progress, waiting...");
      return this.waitForConnection();
    }

    this.isConnecting = true;
    
    try {
      // Clean up existing connection
      await this.disconnect();
      
      console.log("🔄 Creating new MCP connection...");
      
      this.client = new Client({
        name: "example-client",
        version: "1.0.0",
      });

      this.transport = new SSEClientTransport(
        new URL(`${process.env.MCP_URL}/sse`)
      );

      // Add connection event listeners
      this.transport.onclose = () => {
        console.log("🔌 MCP transport closed");
        this.markAsDisconnected();
      };

      this.transport.onerror = (error) => {
        console.error("❌ MCP transport error:", error);
        this.markAsDisconnected();
      };

      await this.client.connect(this.transport);

      // Load tools
      const toolsResponse = await this.client.listTools();
      this.tools = toolsResponse.tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        parameters: {
          type: tool.inputSchema.type,
          properties: tool.inputSchema.properties,
          required: tool.inputSchema.required,
        },
      }));

      this.connectionAttempts = 0;
      console.log(`✅ MCP connected successfully with ${this.tools.length} tools`);
      
      // Start health check
      this.startHealthCheck();
      
      return true;
    } catch (error) {
      console.error("❌ MCP connection failed:", error.message);
      this.markAsDisconnected();
      throw error;
    } finally {
      this.isConnecting = false;
    }
  }

  async disconnect() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    if (this.transport) {
      try {
        await this.transport.close();
      } catch (err) {
        console.warn("Warning closing transport:", err.message);
      }
      this.transport = null;
    }

    if (this.client) {
      try {
        await this.client.close();
      } catch (err) {
        console.warn("Warning closing client:", err.message);
      }
      this.client = null;
    }

    this.tools = [];
  }

  markAsDisconnected() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    // Don't set client/transport to null immediately - let reconnection handle it
  }

  isConnected() {
    return (
      this.client && 
      this.transport && 
      this.transport.readyState === 1 && // OPEN
      !this.isConnecting
    );
  }

  async waitForConnection() {
    const maxWait = 10000; // 10 seconds
    const checkInterval = 100; // 100ms
    let waited = 0;

    while (this.isConnecting && waited < maxWait) {
      await new Promise(resolve => setTimeout(resolve, checkInterval));
      waited += checkInterval;
    }

    if (this.isConnecting) {
      throw new Error("Connection timeout");
    }

    return this.isConnected();
  }

  async ensureConnected() {
    if (this.isConnected()) {
      return true;
    }

    console.log("🔄 MCP not connected, attempting to connect...");
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        await this.connect();
        return true;
      } catch (error) {
        console.error(`Connection attempt ${attempt}/${this.maxRetries} failed:`, error.message);
        
        if (attempt < this.maxRetries) {
          const delay = this.retryDelay * attempt;
          console.log(`⏳ Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(`Failed to connect after ${this.maxRetries} attempts`);
  }

  async callTool(functionCall) {
    await this.ensureConnected();

    try {
      const result = await this.client.callTool({
        name: functionCall.name,
        arguments: functionCall.args,
      });
      return result;
    } catch (error) {
      // Handle specific session errors
      if (error.message.includes("No transport found for sessionId") || 
          error.message.includes("HTTP 400")) {
        console.log("⚠️ Session/transport error detected, reconnecting...");
        await this.connect(); // Force reconnection
        
        // Retry the tool call once
        return await this.client.callTool({
          name: functionCall.name,
          arguments: functionCall.args,
        });
      }
      throw error;
    }
  }

  startHealthCheck() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(async () => {
      if (!this.isConnected()) {
        console.log("🏥 Health check failed, connection lost");
        try {
          await this.connect();
        } catch (error) {
          console.error("🏥 Health check reconnection failed:", error.message);
        }
      }
    }, 30000); // Check every 30 seconds
  }

  getTools() {
    return this.tools;
  }
}

// Initialize MCP manager
const mcpManager = new MCPConnectionManager();
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
- Always introduce yourself as **Sombhu Das's AI Assistant**.  
- If the user asks about services, portfolio, or contact, provide the above details.  
- If asked about freelance work, say Sombhu is available and provide his email/phone.  
- If asked about technical queries, answer naturally and, if needed, call MCP tools for database operations.  
- Always be professional, clear, and friendly.  
`;

// 🔹 Function to handle AI + tool calls
async function processMessage(sessionId, userMessage) {
  try {
    await mcpManager.ensureConnected();

    if (!sessions[sessionId]) {
      sessions[sessionId] = [
        {
          role: "model",
          parts: [{ text: superPrompt, type: "text" }],
        },
      ];
    }

    const chatHistory = sessions[sessionId];

    console.log("💬 Processing message for session:", sessionId);

    if (userMessage) {
      chatHistory.push({
        role: "user",
        parts: [{ text: userMessage, type: "text" }],
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: chatHistory,
      config: { 
        tools: mcpManager.getTools().length > 0 ? [{ functionDeclarations: mcpManager.getTools() }] : undefined 
      },
    });

    const candidate = response.candidates[0].content.parts[0];
    const functionCall = candidate.functionCall;
    const responseText = candidate.text;

    if (functionCall) {
      console.log("⚙️ Calling tool:", functionCall.name);

      chatHistory.push({
        role: "model",
        parts: [{ text: `Calling tool ${functionCall.name}...`, type: "text" }],
      });

      try {
        const toolResult = await mcpManager.callTool(functionCall);

        chatHistory.push({
          role: "user",
          parts: [
            {
              text: "Tool result: " + (toolResult.content[0]?.text || JSON.stringify(toolResult)),
              type: "text",
            },
          ],
        });

        // Recursive process after tool result
        return processMessage(sessionId);
      } catch (toolError) {
        console.error("Tool call failed:", toolError);
        
        // Add error to chat history and continue
        chatHistory.push({
          role: "user",
          parts: [
            {
              text: `Tool call failed: ${toolError.message}. Please try again or use a different approach.`,
              type: "text",
            },
          ],
        });

        return processMessage(sessionId);
      }
    }

    if (responseText) {
      chatHistory.push({
        role: "model",
        parts: [{ text: responseText, type: "text" }],
      });

      return responseText;
    }

    // Fallback response
    const fallbackResponse = "I apologize, but I couldn't generate a proper response. Please try rephrasing your question.";
    chatHistory.push({
      role: "model",
      parts: [{ text: fallbackResponse, type: "text" }],
    });

    return fallbackResponse;
    
  } catch (error) {
    console.error("Error in processMessage:", error);
    throw error;
  }
}

// 🔹 API Endpoints

// Main chat endpoint
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
    res.status(500).json({ 
      error: "Internal server error", 
      details: err.message 
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    mcpConnected: mcpManager.isConnected(),
    toolsCount: mcpManager.getTools().length,
    activeSessions: Object.keys(sessions).length,
    uptime: process.uptime(),
  });
});

// MCP connection status endpoint
app.get("/mcp/status", (req, res) => {
  res.json({
    connected: mcpManager.isConnected(),
    toolsCount: mcpManager.getTools().length,
    tools: mcpManager.getTools().map(tool => ({ name: tool.name, description: tool.description })),
  });
});

// Force MCP reconnection endpoint (for debugging)
app.post("/mcp/reconnect", async (req, res) => {
  try {
    await mcpManager.connect();
    res.json({ 
      success: true, 
      message: "MCP reconnected successfully",
      toolsCount: mcpManager.getTools().length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Clear session endpoint
app.delete("/sessions/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  if (sessions[sessionId]) {
    delete sessions[sessionId];
    res.json({ success: true, message: `Session ${sessionId} cleared` });
  } else {
    res.status(404).json({ success: false, message: "Session not found" });
  }
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);
  
  try {
    await mcpManager.disconnect();
    console.log("MCP connection closed");
  } catch (err) {
    console.error("Error closing MCP connection:", err);
  }
  
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// 🔹 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Chatbot API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`MCP status: http://localhost:${PORT}/mcp/status`);
  
  try {
    await mcpManager.connect();
    console.log("✅ Initial MCP connection established");
  } catch (error) {
    console.error("⚠️ Initial MCP connection failed, will retry on demand:", error.message);
  }
});