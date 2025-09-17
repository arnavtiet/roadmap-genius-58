import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Send, 
  Upload, 
  ArrowLeft, 
  Sparkles, 
  Bot, 
  User,
  FileText,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DynamicRoadmapGraph } from './DynamicRoadmapGraph';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export const RoadmapChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your AI Learning Assistant. I'll help you create a personalized roadmap based on your goals and current skills. To get started, please tell me:\n\n1. What career goal would you like to achieve?\n2. What's your current experience level?\n3. Any specific skills you want to focus on?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [userGoal, setUserGoal] = useState('');

  // Simulated AI responses - Replace with actual API calls
  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('data scientist') || lowerMessage.includes('data science')) {
      setUserGoal('Data Scientist');
      return "Excellent! I can see you want to become a Data Scientist. Based on your goal, I'll create a comprehensive roadmap that covers:\n\n• **Statistics & Mathematics** - Essential foundation\n• **Python Programming** - Primary tool for data science\n• **Machine Learning** - Core algorithms and techniques\n• **Data Visualization** - Communicating insights\n• **Big Data Technologies** - Handling large datasets\n• **Deep Learning** - Advanced AI techniques\n\nLet me generate your personalized roadmap now!";
    }
    
    if (lowerMessage.includes('web developer') || lowerMessage.includes('frontend') || lowerMessage.includes('backend')) {
      setUserGoal('Web Developer');
      return "Great choice! Web development is in high demand. I'll create a roadmap covering:\n\n• **HTML/CSS/JavaScript** - Frontend fundamentals\n• **React/Vue/Angular** - Modern frameworks\n• **Node.js/Express** - Backend development\n• **Databases** - Data storage solutions\n• **DevOps** - Deployment and CI/CD\n• **Testing** - Quality assurance\n\nGenerating your roadmap now!";
    }
    
    if (lowerMessage.includes('ai') || lowerMessage.includes('machine learning') || lowerMessage.includes('artificial intelligence')) {
      setUserGoal('AI Engineer');
      return "Fascinating field! AI Engineering requires a strong foundation. Your roadmap will include:\n\n• **Programming Fundamentals** - Python, R, Java\n• **Mathematics** - Linear algebra, calculus, statistics\n• **Machine Learning** - Supervised/unsupervised learning\n• **Deep Learning** - Neural networks, transformers\n• **MLOps** - Model deployment and monitoring\n• **Ethics in AI** - Responsible AI development\n\nCreating your personalized roadmap!";
    }
    
    return "Thank you for sharing your goal! Based on your input, I'm analyzing the best learning path for you. I'll create a customized roadmap with specific courses, projects, and certifications tailored to your needs. Generating your roadmap now!";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

    // Simulate API call delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getAIResponse(inputValue),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsGenerating(false);

      // Show roadmap after AI response
      setTimeout(() => {
        setShowRoadmap(true);
      }, 1000);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')} 
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-border mx-2" />
              <div className="gradient-primary p-2 rounded-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AI Roadmap Generator</h1>
                <p className="text-sm text-muted-foreground">Create your personalized learning path</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1">
                <Sparkles className="h-3 w-3" />
                AI Powered
              </Badge>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Resume
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)]">
          {/* Chat Interface */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                AI Learning Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4 mb-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`p-2 rounded-full shrink-0 ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'gradient-primary text-white'}`}>
                          {message.type === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </div>
                        <div className={`p-3 rounded-lg ${message.type === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'}`}>
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                          <span className="text-xs opacity-70 mt-2 block">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isGenerating && (
                    <div className="flex gap-3">
                      <div className="gradient-primary p-2 rounded-full">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin">
                            <Sparkles className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm">Analyzing your goals and generating roadmap...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your career goals and current skills..."
                  className="flex-1"
                  disabled={isGenerating}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!inputValue.trim() || isGenerating}
                  className="btn-gradient"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Roadmap Graph */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Generated Roadmap
                {userGoal && (
                  <Badge variant="secondary" className="ml-2">
                    {userGoal}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              {showRoadmap ? (
                <DynamicRoadmapGraph goal={userGoal} />
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div className="space-y-4">
                    <div className="gradient-primary p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Roadmap Preview</h3>
                      <p className="text-sm text-muted-foreground">
                        Share your career goals in the chat to generate your personalized learning roadmap
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};