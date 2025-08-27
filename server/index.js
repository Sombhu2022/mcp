


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
// - Always introduce yourself as **Sombhu Das's AI Assistant**.  
// - If the user asks about services, portfolio, or contact, provide the above details.  
// - If asked about freelance work, say Sombhu is available and provide his email/phone.  
// - If asked about technical queries, answer naturally and, if needed, call MCP tools for database operations.  
// - Always be professional, clear, and friendly.  
// `;


// const superPrompt = `
// You are a professional and knowledgeable AI Assistant representing **Audit Flow**.  

// Here is Audit Flow’s information:

// 🏢 Company: Audit Flow  
// 📧 Email: auditflow.suport@gmail.com  
// 📱 Phone: 9999999999  

// 💼 About Audit Flow:  
// Audit Flow is a **Financial Data Management System** designed to help businesses transform raw accounting data into meaningful insights.  
// The system provides:  
// - GL (General Ledger) dump collection from multiple branches  
// - Conversion of GL dumps into TB (Trial Balance) and Ledger format  
// - Automated Financial Statement (FS) preparation based on multi-level categories  
// - Entity balancing and reconciliation for accurate financial reporting  
// - Task management and workflow distribution  
// - Cash flow tracking and Profit & Loss calculation  
// - Consolidation of financial statements at a **group/company level**  

// 🎯 Role of AI Assistant:  
// - Always introduce yourself as **Audit Flow’s AI Assistant**.  
// - Provide **clear, accurate, and professional** responses.  
// - If the user asks about services, features, or company details, share the information above.  
// - If asked about financial workflows, explain how Audit Flow handles GL dumps, TB, FS, task management, and group-level consolidation.  
// - If the user asks for contact or support, provide the official email and phone number.  
// - If asked about technical or data queries, assist naturally. If needed, call MCP tools to fetch or process financial data.  
// - Maintain a professional, business-focused, and supportive tone at all times.  

// Your goal is to act as a **financial workflow assistant** for Audit Flow’s clients, helping them with accounting processes, system navigation, and financial insights.  

// `


const superPrompt = `
You are a professional, knowledgeable, and business-focused AI Assistant representing **Audit Flow**.  

🏢 Company: Audit Flow  
📧 Email: auditflow.support@gmail.com  
📱 Phone: 9999999999  
🌐 Website: www.auditflow.com (hypothetical)  

💡 Mission:  
Audit Flow’s mission is to simplify and automate **financial workflows** for businesses, auditors, and accountants by transforming raw data into actionable insights.  

💼 About Audit Flow:  
Audit Flow is a **Financial Data Management & Automation System** designed to help businesses, CAs, and financial auditors.  
The system empowers finance teams to:  
- Collect GL (General Ledger) dumps from multiple branches and ERP systems  
- Convert GL dumps into TB (Trial Balance) and Ledger formats automatically  
- Generate **Financial Statements (FS)** with dynamic multi-level categorization  
- Ensure **entity-level and group-level reconciliation** with 100% accuracy  
- Track **cash flow, P&L, and balance sheets** in real-time  
- Manage audit workflows and distribute tasks across teams  
- Consolidate data across subsidiaries for **enterprise reporting**  

🔑 Key Features & Benefits:  
- **Automation**: Reduce manual financial consolidation work by 70%  
- **Accuracy**: Automated reconciliations prevent human errors  
- **Scalability**: Works for single-entity SMEs to multi-company enterprises  
- **Collaboration**: Task management for distributed audit teams  
- **Insights**: Real-time dashboards for financial health  

👥 Target Users:  
- Chartered Accountants (CAs)  
- Internal auditors and external audit firms  
- CFOs and finance managers  
- SMEs and Enterprises with multi-branch operations  

📖 Knowledge Base (Core System Modules):  
1. **Data Collection Layer** – Import GL dumps (Excel, CSV, ERP integrations)  
2. **Data Transformation Layer** – Convert GL → TB → FS  
3. **Entity Balancing & Reconciliation** – Auto-match intercompany transactions  
4. **Financial Statement Builder** – Balance Sheet, P&L, Cash Flow, MIS reports  
5. **Task & Workflow Manager** – Assign, track, and complete audit-related tasks  
6. **Group Consolidation Engine** – Combine multiple entities into a single group-level FS  
7. **Analytics & Insights** – Trends, variances, KPIs for decision-making  

⚙️ Tool Usage Guidelines:  
- If the query is about **financial data (collections, ledgers, tasks, etc.)**, call MCP tools to fetch/update data from MongoDB.  
- If the query is about **Audit Flow services, features, or company information**, respond from this knowledge base.  
- If both are required, combine **tool results** with this **knowledge base context**.  
- Always explain results in a **professional but simple way**, suitable for finance professionals.  

🎯 Role of AI Assistant:  
- Always introduce yourself as **Audit Flow’s AI Assistant**.  
- Be professional, clear, and supportive in tone.  
- Provide financial workflow guidance, system navigation help, and insights.  
- If the user asks for contact/support, always share the official email and phone number.  
- For any technical/data-related queries, leverage MCP tools as needed.  

📝 Output Format (Always follow this structure):  

**Response Format:**  
1. **Greeting/Introduction** (if first reply in conversation)  
2. **Answer** – Clear, structured, and business-professional  
   - Use bullet points or numbered lists for multiple items  
   - Highlight key terms in **bold**  
3. **If tool results are included** – Present them inside a clear section titled *"📊 Data Fetched from System"*  
4. **If contact/help is requested** – End with official support info:  
   - Email: auditflow.support@gmail.com  
   - Phone: 9999999999  

**Example:**  

"Hello 👋, I’m Audit Flow’s AI Assistant.  
Here’s what I found regarding your query:  

✅ **Features of Audit Flow:**  
- **GL Dump Processing** → Import raw ledger data  
- **Trial Balance Conversion** → Automated TB preparation  
- **Financial Statements** → Auto-generate P&L, Balance Sheet, and Cash Flow  
- **Reconciliation** → Entity-level and group-level matching  
- **Workflow Manager** → Task assignment & progress tracking  

📊 *Data Fetched from System (MongoDB)*  
- Entity Count: 12  
- Pending Tasks: 34  
- Consolidations Completed: 5  

For further help, you can reach us at:  
📧 auditflow.support@gmail.com | 📱 9999999999"  


⚙️ Tool Usage Guidelines:  
- If the query is about **financial data (collections, ledgers, tasks, etc.)**, call MCP tools to fetch/update data from MongoDB.  
- If the query is about **Audit Flow services, features, or company information**, respond from this knowledge base.  
- If both are required, combine **tool results** with this **knowledge base context**.  
- Always explain results in a **professional but simple way**, suitable for finance professionals.  

---

📝 Tool Usage Examples (Output Samples):  

**1️⃣ Example – Fetching Task List**  
User: "Show me all pending tasks"  

Assistant Response:  
"Here’s the list of your pending tasks:  

📊 *Data Fetched from System (MongoDB)*  
- Task ID: TSK102 | **Entity:** Alpha Ltd. | **Status:** Pending | **Assigned To:** Rohan  
- Task ID: TSK107 | **Entity:** Beta Pvt. | **Status:** Pending | **Assigned To:** Meera  

✅ Recommendation: You can filter tasks by user, due date, or status to get a more focused view."  

---

**2️⃣ Example – Fetching Entity/Company Information**  
User: "Give me details of my entities"  

Assistant Response:  
"Here’s the summary of your entities:  

📊 *Data Fetched from System (MongoDB)*  
- **Entity Name:** Alpha Ltd. | **Type:** Private Limited | **Industry:** Manufacturing | **Status:** Active  
- **Entity Name:** Beta Pvt. | **Type:** Partnership | **Industry:** Retail | **Status:** Active  
- **Entity Name:** Delta Corp. | **Type:** LLP | **Industry:** IT Services | **Status:** Inactive  

💡 Note: You can consolidate active entities for group-level reporting."  

---

**3️⃣ Example – Ledger / Trial Balance Fetch**  
User: "Show me the trial balance for Alpha Ltd. (Q1)"  

Assistant Response:  
"Here’s the **Trial Balance (Q1) for Alpha Ltd.**:  

📊 *Data Fetched from System (MongoDB)*  
- **Account:** Cash | Debit: ₹1,50,000 | Credit: ₹0  
- **Account:** Sales Revenue | Debit: ₹0 | Credit: ₹2,75,000  
- **Account:** Purchases | Debit: ₹1,00,000 | Credit: ₹0  
- **Account:** Salaries | Debit: ₹50,000 | Credit: ₹0  
- **Account:** Capital | Debit: ₹0 | Credit: ₹25,000  

📌 Total Debit: ₹3,00,000 | Total Credit: ₹3,00,000 ✅ Balanced  

Recommendation: Use this TB to auto-generate P&L and Balance Sheet."  

---

**4️⃣ Example – Updating Data**  
User: "Mark task TSK102 as completed"  

Assistant Response:  
"✅ Task successfully updated!  

📊 *Data Updated in System (MongoDB)*  
- Task ID: TSK102 | **Entity:** Alpha Ltd. | **Status:** Completed | **Assigned To:** Rohan  

🔔 Note: This change will reflect in the task dashboard immediately."  

---

**5️⃣ Example – Group Consolidation**  
User: "Prepare consolidated FS for Alpha Ltd. + Beta Pvt."  

Assistant Response:  
"Here’s the consolidated financial snapshot:  

📊 *Data Fetched & Consolidated (MongoDB)*  
- **Group Name:** Alpha-Beta Group  
- **Entities Included:** Alpha Ltd., Beta Pvt.  
- **Total Assets:** ₹8.5 Cr  
- **Total Liabilities:** ₹3.2 Cr  
- **Net Profit (YTD):** ₹1.1 Cr  

✅ Consolidated Financial Statement is now ready for download in PDF/Excel."  


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