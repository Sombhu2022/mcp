import { Message } from './ChatInterface';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender === 'user';

  return (
    <div
      className={cn(
        'flex w-full animate-in slide-in-from-bottom-2 duration-300',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div className={cn('flex items-end space-x-2 max-w-[80%]')}>
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow">
            <div className="w-4 h-4 bg-white rounded-full opacity-90" />
          </div>
        )}
        
        <div
          className={cn(
            'px-4 py-3 rounded-2xl shadow-message transition-all duration-300 hover:shadow-lg',
            isUser
              ? 'bg-chat-user-bg text-chat-user-text ml-4 rounded-br-md'
              : 'bg-chat-bot-bg text-chat-bot-text mr-4 rounded-bl-md border border-border'
          )}
        >
          <p className="text-sm leading-relaxed">{message.text}</p>
          <div className="mt-1 opacity-70">
            <span className="text-xs">
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>

        {isUser && (
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
            <div className="w-5 h-5 text-white text-xs font-bold flex items-center justify-center">
              U
            </div>
          </div>
        )}
      </div>
    </div>
  );
};