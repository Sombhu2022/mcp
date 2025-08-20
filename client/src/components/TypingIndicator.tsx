export const TypingIndicator = () => {
  return (
    <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-end space-x-2 max-w-[80%]">
        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow">
          <div className="w-4 h-4 bg-white rounded-full opacity-90" />
        </div>
        
        <div className="px-4 py-3 rounded-2xl bg-chat-bot-bg border border-border shadow-message mr-4 rounded-bl-md">
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="text-xs text-muted-foreground ml-2">typing...</span>
          </div>
        </div>
      </div>
    </div>
  );
};