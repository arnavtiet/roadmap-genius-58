import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatbotProps {
  isCompact?: boolean;
  isCollapsed?: boolean;
  onSubmit?: (message: string) => void;
  onToggleCollapse?: () => void;
  className?: string;
}

export const Chatbot: React.FC<ChatbotProps> = ({
  isCompact = false,
  isCollapsed = false,
  onSubmit,
  onToggleCollapse,
  className
}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    onSubmit?.(message);
    setMessage('');
    setIsLoading(false);
  };

  if (isCollapsed) {
    return null; // Handled by parent component
  }

  return (
    <Card className={cn(
      "transition-all duration-500 ease-out bg-card-glass border-chatbot-border",
      isCompact 
        ? "w-80 h-full flex flex-col md:border-r md:rounded-none md:border-l-0 md:border-t-0 md:border-b-0" 
        : "w-full max-w-2xl mx-auto glass shadow-chat chatbot-enter",
      className
    )}>
      {isCompact && (
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <span className="font-semibold">Course Assistant</span>
          </div>
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button> */}
        </div>
      )}

      <div className={cn(
        "flex flex-col",
        isCompact ? "flex-1 p-4" : "p-8"
      )}>
        {!isCompact && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Course Development Assistant
            </h1>
            <p className="text-muted-foreground text-lg">
              Tell me about your learning goals and I'll create a personalized roadmap
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isCompact ? "Ask about courses..." : "What would you like to learn? (e.g., 'React development', 'Data science', 'UI design')"}
              className="flex-1 glass border-chatbot-border"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !message.trim()}
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {!isCompact && (
            <div className="flex flex-wrap gap-2 mt-2">
              {['React Development', 'Data Science', 'UI/UX Design', 'Python Programming'].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => setMessage(suggestion)}
                  className="glass border-chatbot-border hover-lift"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}
        </form>
      </div>
    </Card>
  );
};