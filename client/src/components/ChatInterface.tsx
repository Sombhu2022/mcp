// import { useState, useRef, useEffect } from 'react';
// import { ChatMessage } from './ChatMessage';
// import { ChatInput } from './ChatInput';
// import { TypingIndicator } from './TypingIndicator';
// import axios from 'axios'

// export interface Message {
//   id: string;
//   text: string;
//   sender: 'user' | 'bot';
//   timestamp: Date;
// }

// export const ChatInterface = () => {
//   const [ip, setIp] = useState("");
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       text: 'Hello! I\'m your personal chatbot assistant. How can I help you today?',
//       sender: 'bot',
//       timestamp: new Date(),
//     },
//   ]);
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     fetch("https://api.ipify.org?format=json")
//       .then((res) => res.json())
//       .then((data) => setIp(data.ip))
//       .catch((err) => console.error(err));
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, isTyping]);

//   const handleSendMessage = async (text: string) => {
//     const userMessage: Message = {
//       id: Date.now().toString(),
//       text,
//       sender: 'user',
//       timestamp: new Date(),
//     };

//     const body =  {
//     "sessionId":ip,
//     "message" :text
//     }
//     setMessages(prev => [...prev, userMessage]);
//     setIsTyping(true);

//     // const url = 'https://mcp-server-api.vercel.app/chat';
//     const url = 'http://localhost:3000/chat';

//     try {
//       const { data } = await axios.post(url , body)

//       console.log(data);

//       // Simulate bot response

//         const botResponse: Message = {
//           id: (Date.now() + 1).toString(),
//           text: data.reply,
//           sender: 'bot',
//           timestamp: new Date(),
//         };

//         setMessages(prev => [...prev, botResponse]);

//     } catch (error) {

//       const botResponse: Message = {
//           id: (Date.now() + 1).toString(),
//           text: "Something Error or Service not available. Please try again .",
//           sender: 'bot',
//           timestamp: new Date(),
//         };

//         setMessages(prev => [...prev, botResponse]);

//     }

//       setIsTyping(false);

//   };

//   const generateBotResponse = (userText: string): string => {
//     const responses = [
//       'That\'s interesting! Tell me more about that.',
//       'I understand. How does that make you feel?',
//       'That\'s a great question. Let me think about that.',
//       'I see what you mean. Have you considered other perspectives?',
//       'Thanks for sharing that with me.',
//       'That sounds important to you.',
//       'I\'m here to help. What would you like to explore next?',
//       'That\'s fascinating! I\'d love to learn more.',
//     ];

//     return responses[Math.floor(Math.random() * responses.length)];
//   };

//   return (
//     <div className="flex flex-col h-screen  md:w-2/3 bg-gradient-background">
//       {/* Header */}
//       <div className="p-6 bg-gradient-glass border-b border-border backdrop-blur-sm">
//         <h1 className="text-2xl font-bold text-foreground">Personal Assistant</h1>
//         <p className="text-muted-foreground">Your AI companion for daily conversations</p>
//       </div>

//       {/* Messages Container */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((message) => (
//           <ChatMessage key={message.id} message={message} />
//         ))}
//         {isTyping && <TypingIndicator />}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Area */}
//       <div className="p-4 bg-gradient-glass border-t border-border backdrop-blur-sm">
//         <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
//       </div>
//     </div>
//   );
// };

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import axios from "axios";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export const ChatInterface = () => {
  const [ip, setIp] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your personal chatbot assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [draft, setDraft] = useState(""); // for input pre-fill
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIp(data.ip))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    const body = {
      sessionId: ip,
      message: text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setDraft(""); // clear input after send
    setIsTyping(true);

    const url = 'https://mcp-server-api.vercel.app/chat';
    // const url = "http://localhost:3000/chat";

    try {
      const { data } = await axios.post(url, body);

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Something Error or Service not available. Please try again .",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    }

    setIsTyping(false);
  };

  // Demo prompts
  const demoPrompts = [
    // 📘 Knowledge Base (product + MongoDB concepts)
    {
      title: "📘 What is AuditFlow?",
      text: "Explain briefly what AuditFlow does in simple words",
    },
    {
      title: "📞 How to contact?",
      text: " How to contact Audit flow and how to support ",
    },

    // 🛠️ Tools / Data Access (real queries with your system)
    {
      title: "📝 All Tasks",
      text: "Find all documents from the tasks collection",
    },
    {
      title: "👤 User Directory",
      text: "List all documents from the users collection with name and email fields",
    },
    {
      title: "📂 Categories",
      text: "Show all category documents from the categories collection",
    },
    {
      title: "⏳ Pending Tasks",
      text: "Find all documents in the tasks collection where status = pending",
    },
    {
      title: "🏢 Companies",
      text: "Get all company documents from the companies collection",
    },
    // {
    //   title: "📑 Entities",
    //   text: "Get all entity documents from the entities collection with their fields",
    // },
  ];

  return (
    <div className="flex flex-col h-screen md:w-2/3 bg-gradient-background">
      {/* Header */}
      <div className="p-6 bg-gradient-glass border-b border-border backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-foreground">
          Personal Assistant
        </h1>
        <p className="text-muted-foreground">
          Your AI companion for daily conversations
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Demo Prompts Section */}
      <div className="p-3 border-t border-border bg-gradient-glass flex flex-wrap gap-2 overflow-x-auto">
        {demoPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => setDraft(prompt.text)} // fill input field
            className="px-3 py-2 border border-pink-500 text-sm rounded-xl  transition"
          >
            {prompt.title}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gradient-glass border-t border-border backdrop-blur-sm">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isTyping}
          value={draft}
          // onChange={setDraft}
        />
      </div>
    </div>
  );
};
