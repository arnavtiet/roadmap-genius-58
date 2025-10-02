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

      const response = await fetch('http://localhost:5001/generate-roadmap', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // Add fallback for when server is not available
        if (response.status === 0 || !response.status) {
          console.log('Server not available, using mock data');
          const mockData = {
            roadmap: {
              nodes: [
                {
                  id: '1',
                  type: 'phaseTitle',
                  data: { label: 'Phase 1: Foundation' },
                  position: { x: 0, y: 0 }
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
                  position: { x: 0, y: 100 }
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
                  position: { x: 0, y: 300 }
                }
              ],
              edges: []
            },
            message: 'Mock roadmap generated for testing (server not available)'
          };
          
          const roadmapData = mockData.roadmap;
          setRoadmapData(roadmapData);          // Process mock nodes with better positioning
          const nodes = roadmapData.nodes || [];
          const edges = roadmapData.edges || [];
          
          // Create better layout with phases
          const processedNodes: RoadmapNode[] = [];
          let currentY = 0;
          
          // Add phase title
          processedNodes.push({
            id: 'phase-1',
            type: 'phaseTitle',
            data: { label: 'Phase 1: Foundation' },
            position: { x: 200, y: currentY }
          });
          currentY += 100;
          
          // Add topic nodes
          nodes.filter(n => n.type === 'topic').forEach((node, index) => {
            processedNodes.push({
              ...node,
              position: { x: 200, y: currentY + (index * 150) }
            });
          });
          
          // Generate sequential edges
          const generatedEdges: Edge[] = [];
          for (let i = 0; i < processedNodes.length - 1; i++) {
            const currentNode = processedNodes[i];
            const nextNode = processedNodes[i + 1];
            generatedEdges.push({
              id: `edge-${currentNode.id}-${nextNode.id}`,
              source: currentNode.id,
              target: nextNode.id,
              type: 'smoothstep',
              animated: true,
              style: { strokeWidth: 2, stroke: '#8b5cf6' }
            });
          }
          
          setNodes(improvedNodes);
          setEdges(generatedEdges);
          setChatMessages([{
            id: '1',
            type: 'assistant',
            content: mockData.message,
            timestamp: new Date()
          }]);
          setIsChatOpen(true);
          setIsGenerating(false);
          return;
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }      const roadmapData = data.roadmap;
      setRoadmapData(roadmapData);
        // Handle nodes and edges, ensuring connections exist
      const nodes = roadmapData.nodes || [];
      const edges = roadmapData.edges || [];
      
      // Improve node positioning for better layout
      const improvedNodes = nodes.map((node, index) => ({
        ...node,
        position: {
          x: Math.floor(index / 3) * 400, // Create columns every 3 nodes
          y: (index % 3) * 200 + 50 // Vertical spacing
        }
      }));
      
      // If no edges exist, create sequential connections between nodes
      if (edges.length === 0 && nodes.length > 1) {
        const generatedEdges: Edge[] = [];
        for (let i = 0; i < nodes.length - 1; i++) {
          const currentNode = nodes[i];
          const nextNode = nodes[i + 1];
          if (currentNode && nextNode) {
            generatedEdges.push({
              id: `edge-${currentNode.id}-${nextNode.id}`,
              source: currentNode.id,
              target: nextNode.id,
              type: 'smoothstep',
              animated: true,
              style: { strokeWidth: 2, stroke: '#8b5cf6' }
            });
          }
        }
        setEdges(generatedEdges);
      } else {
        setEdges(edges);
      }
      
      setNodes(improvedNodes);
      
      // Add initial message to chat
      setChatMessages([
        {
          id: '1',
          type: 'assistant',
          content: data.message || 'Roadmap generated successfully!',
          timestamp: new Date()
        }
      ]);
      
      setIsChatOpen(true);    } catch (error) {
      console.error('Error generating roadmap:', error);
      const errorMessage: ChatMessage = {
        id: '1',
        type: 'assistant',
        content: `Error generating roadmap: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      setChatMessages([errorMessage]);
      setIsChatOpen(true); // Show chat even on error to display the error message
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
      }      const updatedRoadmapData = data.roadmap;
      setRoadmapData(updatedRoadmapData);
        // Handle nodes and edges for refinement as well
      const nodes = updatedRoadmapData.nodes || [];
      const edges = updatedRoadmapData.edges || [];
      
      // Improve node positioning for better layout
      const improvedNodes = nodes.map((node, index) => ({
        ...node,
        position: {
          x: Math.floor(index / 3) * 400, // Create columns every 3 nodes
          y: (index % 3) * 200 + 50 // Vertical spacing
        }
      }));
      
      // If no edges exist, create sequential connections between nodes
      if (edges.length === 0 && nodes.length > 1) {
        const generatedEdges: Edge[] = [];
        for (let i = 0; i < nodes.length - 1; i++) {
          const currentNode = nodes[i];
          const nextNode = nodes[i + 1];
          if (currentNode && nextNode) {
            generatedEdges.push({
              id: `edge-${currentNode.id}-${nextNode.id}`,
              source: currentNode.id,
              target: nextNode.id,
              type: 'smoothstep',
              animated: true,
              style: { strokeWidth: 2, stroke: '#8b5cf6' }
            });
          }
        }
        setEdges(generatedEdges);
      } else {
        setEdges(edges);
      }
      
      setNodes(improvedNodes);

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
  };  return (
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
          </div>          {/* Chat Messages */}
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
                padding: 0.1,
                includeHiddenNodes: false,
              }}
              defaultEdgeOptions={{
                animated: true,
                type: 'smoothstep',
                style: { strokeWidth: 2, stroke: '#8b5cf6' },
              }}
              className="bg-background"
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