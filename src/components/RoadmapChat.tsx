
import React, { useState } from 'react';
import { Chatbot } from '@/components/ChatBot';
import { SkillRoadmap } from '@/components/SkillRoadmap';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const RoadmapChat = () => {
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [isChatbotCollapsed, setIsChatbotCollapsed] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');

  const handleChatSubmit = (message: string) => {
    setCurrentPrompt(message);
    setShowRoadmap(true);
    // Small delay to allow roadmap to load before transitioning chatbot
    setTimeout(() => {
      setIsChatbotCollapsed(false);
    }, 600);
  };

  const toggleChatbot = () => {
    setIsChatbotCollapsed(!isChatbotCollapsed);
  };

  return (
    <div className="min-h-screen w-full">
      {/* Landing State - Centered Chatbot */}
      {!showRoadmap && (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Chatbot onSubmit={handleChatSubmit} />
        </div>
      )}

      {/* Roadmap State - Sidebar Layout */}
      {showRoadmap && (
        <div className="flex h-screen">
          {/* Sidebar Chatbot - Hidden on mobile when collapsed */}
          <div className={cn(
            "md:block",
            isChatbotCollapsed ? "hidden" : "block"
          )}>
            <Chatbot
              isCompact
              isCollapsed={isChatbotCollapsed}
              onSubmit={handleChatSubmit}
              onToggleCollapse={toggleChatbot}
            />
          </div>
          
          {/* Collapsed button for mobile */}
          {isChatbotCollapsed && (
            <Button
              onClick={toggleChatbot}
              className="fixed top-4 left-4 z-50 rounded-full w-12 h-12 bg-primary hover:bg-primary/90 shadow-chat md:hidden"
              size="icon"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          )}
          
          {/* Main Roadmap Area */}
          <div className={cn(
            "flex-1 transition-all duration-300",
            
            // !isChatbotCollapsed ? "md:ml-0" : "md:ml-[336px]"
          )}>
            <SkillRoadmap isVisible={showRoadmap} prompt={currentPrompt} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapChat;