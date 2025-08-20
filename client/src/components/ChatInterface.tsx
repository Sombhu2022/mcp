import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import axios from 'axios'

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your personal chatbot assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    const body =  {
    "sessionId":"user2=1",
    "message" :text
    }
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    const { data } = await axios.post('http://localhost:3000/chat' , body)

    console.log(data);
    


    // Simulate bot response
    
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
   
  };

  const generateBotResponse = (userText: string): string => {
    const responses = [
      'That\'s interesting! Tell me more about that.',
      'I understand. How does that make you feel?',
      'That\'s a great question. Let me think about that.',
      'I see what you mean. Have you considered other perspectives?',
      'Thanks for sharing that with me.',
      'That sounds important to you.',
      'I\'m here to help. What would you like to explore next?',
      'That\'s fascinating! I\'d love to learn more.',
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="flex flex-col h-screen w-2/3 bg-gradient-background">
      {/* Header */}
      <div className="p-6 bg-gradient-glass border-b border-border backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-foreground">Personal Assistant</h1>
        <p className="text-muted-foreground">Your AI companion for daily conversations</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gradient-glass border-t border-border backdrop-blur-sm">
        <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
};