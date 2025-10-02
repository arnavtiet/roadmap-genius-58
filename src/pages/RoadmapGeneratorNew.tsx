import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ReactFlow, useNodesState, useEdgesState, addEdge, Background, Controls, MiniMap, Node, Edge, Connection } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Send, MessageCircle, Zap, Clock, Target, BookOpen, Brain, Code, Database, BarChart3, Award, Loader2, X, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import '@xyflow/react/dist/style.css';

interface RoadmapStep {
  title?: string;
  name?: string;
}

interface RoadmapNode {
  id: string;
  type: string;
  data: {
    label: string;
    phase?: string;
    estimated_time?: string;
    difficulty?: string;
    subSteps?: string[];
    name?: string;
    sub_steps?: RoadmapStep[];
  };
  position: { x: number; y: number };
}

interface NodeData {
  label?: string;
  name?: string;
  phase?: string;
  estimated_time?: string;
  difficulty?: string;
  subSteps?: string[];
  sub_steps?: RoadmapStep[];
}

interface RoadmapData {
  nodes: RoadmapNode[];
  edges: Edge[];
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Custom Node Components
const TopicNode = ({ data }: { data: NodeData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getTypeIcon = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return <BookOpen className="h-4 w-4" />;
      case 'intermediate': return <Code className="h-4 w-4" />;
      case 'advanced': return <Brain className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-80 shadow-lg border-l-4 border-l-primary hover:shadow-xl transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            {getTypeIcon(data.difficulty || '')}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-2 line-clamp-2">
              {data.label || data.name}
            </h3>
            
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={getDifficultyColor(data.difficulty || '')}>
                {data.difficulty || 'N/A'}
              </Badge>
              {data.estimated_time && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {data.estimated_time}
                </div>
              )}
            </div>

            {(data.subSteps || data.sub_steps) && (
              <div className="mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-6 px-2 text-xs"
                >
                  {isExpanded ? 'Hide' : 'Show'} Steps ({(data.subSteps || data.sub_steps)?.length || 0})
                </Button>
                
                {isExpanded && (
                  <div className="mt-2 space-y-1">
                    {(data.subSteps || data.sub_steps)?.map((step: string | RoadmapStep, index: number) => (
                      <div key={index} className="text-xs text-muted-foreground pl-2 border-l-2 border-gray-200">
                        {typeof step === 'string' ? step : step.title || step.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PhaseTitleNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-lg min-w-72">
      <div className="text-center">
        <h2 className="text-lg font-bold">{data.label}</h2>
      </div>
    </div>
  );
};

const nodeTypes = {
  topic: TopicNode,
  phaseTitle: PhaseTitleNode,
  step: TopicNode, // Reuse TopicNode for steps
};

// Helper function to process API response and create proper nodes/edges layout
const processRoadmapData = (apiData: any): { nodes: RoadmapNode[], edges: Edge[] } => {
  const nodes: RoadmapNode[] = [];
  const edges: Edge[] = [];
  
  if (!apiData || !apiData.nodes) {
    return { nodes, edges };
  }

  let currentY = 0;
  const verticalSpacing = 180;
  const horizontalCenter = 300;
  
  // Group nodes by phase
  const phaseGroups: { [key: string]: RoadmapNode[] } = {};
  const phaseNodes: RoadmapNode[] = [];
  const topicNodes: RoadmapNode[] = [];

  apiData.nodes.forEach((node: RoadmapNode) => {
    if (node.type === 'phaseTitle') {
      phaseNodes.push(node);
    } else if (node.type === 'topic' || node.type === 'step') {
      topicNodes.push(node);
    }
  });

  // If we have phase nodes, use them to organize
  if (phaseNodes.length > 0) {
    phaseNodes.forEach((phaseNode, phaseIndex) => {
      // Add phase title
      nodes.push({
        ...phaseNode,
        position: { x: horizontalCenter, y: currentY }
      });
      currentY += 100;

      // Find topics for this phase (basic grouping)
      const topicsPerPhase = Math.ceil(topicNodes.length / phaseNodes.length);
      const startIndex = phaseIndex * topicsPerPhase;
      const endIndex = Math.min(startIndex + topicsPerPhase, topicNodes.length);
      const phaseTopics = topicNodes.slice(startIndex, endIndex);

      let previousNodeId = phaseNode.id;
      
      phaseTopics.forEach((topicNode, topicIndex) => {
        const processedNode = {
          ...topicNode,
          position: { x: horizontalCenter, y: currentY }
        };
        nodes.push(processedNode);

        // Create edge from previous node
        edges.push({
          id: `edge-${previousNodeId}-${processedNode.id}`,
          source: previousNodeId,
          target: processedNode.id,
          type: 'smoothstep',
          animated: true,
          style: { strokeWidth: 2, stroke: '#8b5cf6' }
        });

        previousNodeId = processedNode.id;
        currentY += verticalSpacing;
      });

      currentY += 50; // Extra space between phases
    });
  } else {
    // No phase nodes, just arrange topics vertically
    let previousNodeId: string | null = null;
    
    topicNodes.forEach((node, index) => {
      const processedNode = {
        ...node,
        position: { x: horizontalCenter, y: currentY }
      };
      nodes.push(processedNode);

      if (previousNodeId) {
        edges.push({
          id: `edge-${previousNodeId}-${processedNode.id}`,
          source: previousNodeId,
          target: processedNode.id,
          type: 'smoothstep',
          animated: true,
          style: { strokeWidth: 2, stroke: '#8b5cf6' }
        });
      }

      previousNodeId = processedNode.id;
      currentY += verticalSpacing;
    });
  }

  return { nodes, edges };
};

const RoadmapGenerator = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat messages
  const scrollToBottom = () => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  // Generate initial roadmap
  const generateRoadmap = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      
      if (selectedFile) {
        formData.append('resume', selectedFile);
      }

      let response;
      let data;

      try {
        response = await fetch('http://localhost:5001/generate-roadmap', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
      } catch (fetchError) {
        // Fallback to mock data if server is not available
        console.log('Server not available, using mock data');
        data = {
          roadmap: {
            nodes: [
              {
                id: '1',
                type: 'phaseTitle',
                data: { label: 'Phase 1: Foundation Skills' },
                position: { x: 300, y: 0 }
              },
              {
                id: '2',
                type: 'topic',
                data: { 
                  label: 'Learn JavaScript Fundamentals',
                  difficulty: 'beginner',
                  estimated_time: '4 weeks',
                  subSteps: ['Variables and Data Types', 'Functions', 'DOM Manipulation', 'Event Handling']
                },
                position: { x: 300, y: 150 }
              },
              {
                id: '3',
                type: 'topic',
                data: { 
                  label: 'React Basics',
                  difficulty: 'intermediate',
                  estimated_time: '3 weeks',
                  subSteps: ['Components', 'Props and State', 'Event Handling', 'Lifecycle Methods']
                },
                position: { x: 300, y: 330 }
              },
              {
                id: '4',
                type: 'phaseTitle',
                data: { label: 'Phase 2: Advanced Topics' },
                position: { x: 300, y: 510 }
              },
              {
                id: '5',
                type: 'topic',
                data: { 
                  label: 'Advanced React & State Management',
                  difficulty: 'advanced',
                  estimated_time: '4 weeks',
                  subSteps: ['Hooks', 'Context API', 'Redux', 'Performance Optimization']
                },
                position: { x: 300, y: 660 }
              }
            ],
            edges: []
          },
          message: 'Mock roadmap generated (server not available) - showing structured learning path'
        };
      }

      const apiRoadmapData = data.roadmap;
      
      // Process the data to ensure proper layout
      const { nodes: processedNodes, edges: processedEdges } = processRoadmapData(apiRoadmapData);
      
      const finalRoadmapData = {
        nodes: processedNodes,
        edges: processedEdges
      };
      
      setRoadmapData(finalRoadmapData);
      setNodes(processedNodes);
      setEdges(processedEdges);
      
      // Add initial message to chat
      setChatMessages([
        {
          id: '1',
          type: 'assistant',
          content: data.message || 'Roadmap generated successfully! You can see the learning phases and connected topics.',
          timestamp: new Date()
        }
      ]);
      
      setIsChatOpen(true);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      const errorMessage: ChatMessage = {
        id: '1',
        type: 'assistant',
        content: `Error generating roadmap: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      setChatMessages([errorMessage]);
      setIsChatOpen(true);
    } finally {
      setIsGenerating(false);
    }
  };

  // Refine roadmap based on chat input
  const refineRoadmap = async () => {
    if (!chatInput.trim() || !roadmapData) return;

    setIsRefining(true);
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('http://localhost:5001/refine-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_message: chatInput,
          current_roadmap: roadmapData
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const apiRoadmapData = data.roadmap;
      
      // Process the refined data
      const { nodes: processedNodes, edges: processedEdges } = processRoadmapData(apiRoadmapData);
      
      const finalRoadmapData = {
        nodes: processedNodes,
        edges: processedEdges
      };
      
      setRoadmapData(finalRoadmapData);
      setNodes(processedNodes);
      setEdges(processedEdges);

      // Add assistant response to chat
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.message || 'Roadmap updated successfully!',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error refining roadmap:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Error refining roadmap: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsRefining(false);
      setChatInput('');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (roadmapData) {
        refineRoadmap();
      } else {
        generateRoadmap();
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Chat Sidebar - Left side */}
      {isChatOpen && roadmapData && (
        <div className="w-80 border-r bg-card/50 backdrop-blur-sm flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span className="font-semibold">Refine Roadmap</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsChatOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "p-3 rounded-lg max-w-[280px]",
                  message.type === 'user' 
                    ? "bg-primary text-primary-foreground ml-auto" 
                    : "bg-muted mr-auto"
                )}
              >
                <p className="text-sm">{message.content}</p>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
            <div ref={chatMessagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask me to modify the roadmap..."
                className="flex-1 min-h-10 max-h-32"
                onKeyPress={handleKeyPress}
              />
              <Button 
                onClick={refineRoadmap}
                disabled={isRefining || !chatInput.trim()}
                size="icon"
                className="shrink-0"
              >
                {isRefining ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="gradient-primary p-2 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">AI Roadmap Generator</h1>
                  <p className="text-sm text-muted-foreground">Create personalized learning paths with AI</p>
                </div>
              </div>
              
              {roadmapData && (
                <Button
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className="gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  {isChatOpen ? 'Hide Chat' : 'Open Chat'}
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Input Section */}
        {!roadmapData && (
          <div className="flex-1 flex items-center justify-center p-6">
            <Card className="w-full max-w-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Generate Your Learning Roadmap</CardTitle>
                <p className="text-muted-foreground">
                  Describe what you'd like to learn and we'll create a personalized roadmap for you
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., I want to become a full-stack developer with React and Node.js"
                  className="min-h-32"
                  onKeyPress={handleKeyPress}
                />
                
                {/* File Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload Resume (Optional)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>

                <Button 
                  onClick={generateRoadmap}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full gap-2"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  {isGenerating ? 'Generating...' : 'Generate Roadmap'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* React Flow Visualization */}
        {roadmapData && (
          <div className="flex-1">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{
                padding: 0.2,
                includeHiddenNodes: false,
                maxZoom: 1.2,
                minZoom: 0.5
              }}
              defaultEdgeOptions={{
                animated: true,
                type: 'smoothstep',
                style: { strokeWidth: 2, stroke: '#8b5cf6' },
              }}
              className="bg-background"
              proOptions={{ hideAttribution: true }}
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapGenerator;
