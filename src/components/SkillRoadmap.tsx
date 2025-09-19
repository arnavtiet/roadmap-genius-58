/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  NodeTypes,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, CheckCircle, Circle, ExternalLink, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getLayoutedElements } from './Nodestructure';

// Custom Node Component
const SkillNode = ({ data, selected }: { data: any; selected: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    if (data.forceExpanded) {
      setIsExpanded(true);
    }
  }, [data.forceExpanded]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    data.onToggle?.(data.id, !isExpanded);
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-300 border-2 hover-lift cursor-pointer",
        "min-w-[200px] bg-gradient-node border-primary/20",
        selected && "border-primary shadow-node",
        isExpanded && "w-80",
        data.completed && "border-green-400 bg-green-50"
      )}
      onClick={handleToggle}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            data.completed ? "bg-green-500" : "bg-primary"
          )}>
            {data.completed ? (
              <CheckCircle className="w-4 h-4 text-white" />
            ) : (
              <Circle className="w-4 h-4 text-white" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1 leading-tight">
              {data.title}
            </h3>
            
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {data.level}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {data.duration}
              </div>
            </div>

            {isExpanded && (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-muted-foreground">
                  {data.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{data.progress}%</span>
                  </div>
                  <Progress value={data.progress} className="h-2" />
                </div>

                {data.resources && data.resources.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      Resources
                    </h4>
                    <div className="space-y-1">
                      {data.resources.map((resource: any, index: number) => (
                        <a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3 h-3" />
                          {resource.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    data.onMarkComplete?.(data.id);
                  }}
                  className={cn(
                    "w-full",
                    data.completed 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-gradient-primary hover:opacity-90"
                  )}
                >
                  {data.completed ? 'Completed' : 'Mark as Complete'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </Card>
  );
};

const nodeTypes: NodeTypes = {
  skillNode: SkillNode,
};

interface SkillRoadmapProps {
  isVisible?: boolean;
  prompt?: string;
}

export const SkillRoadmap: React.FC<SkillRoadmapProps> = ({ 
  isVisible = false,
  prompt = ""
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Load roadmap data based on prompt
  useEffect(() => {
    if (prompt) {
      loadRoadmapData(prompt);
    }
  }, [prompt]);

  // Load persisted state
  useEffect(() => {
    const savedState = localStorage.getItem('skillRoadmapState');
    if (savedState) {
      const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedState);
      setNodes(savedNodes);
      setEdges(savedEdges);
    }
  }, [setNodes, setEdges]);

  // Save state to localStorage
  useEffect(() => {
    if (nodes.length > 0) {
      localStorage.setItem('skillRoadmapState', JSON.stringify({ nodes, edges }));
    }
  }, [nodes, edges]);

  const loadRoadmapData = async (userPrompt: string) => {
    // Simulate API call - in real app this would be /api/roadmap
    const mockData = await getMockRoadmapData(userPrompt);
    
    const skillNodes = mockData.skills.map((skill: any, index: number) => ({
      id: skill.id,
      type: 'skillNode',
      position: { x: (index % 3) * 250, y: Math.floor(index / 3) * 200 },
      data: {
        ...skill,
        onToggle: handleNodeToggle,
        onMarkComplete: handleMarkComplete,
      },
    }));

    const skillEdges = mockData.connections.map((conn: any) => ({
      id: `${conn.from}-${conn.to}`,
      source: conn.from,
      target: conn.to,
      type: 'smoothstep',
      style: { stroke: 'hsl(250 84% 54%)', strokeWidth: 2 },
    }));

     const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(skillNodes, skillEdges, 'TB');
  setNodes(layoutedNodes);
  setEdges(layoutedEdges);
  };

  const handleNodeToggle = useCallback((nodeId: string, expanded: boolean) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, forceExpanded: expanded },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleMarkComplete = useCallback((nodeId: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, completed: !node.data.completed },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const  handleExport = async() => {
    const element = document.getElementById('roadmap-flow-container');
  if (!element) return;

  const canvas = await html2canvas(element, {
    backgroundColor: null,
    useCORS: true,
    scale: 2,
  });
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [canvas.width, canvas.height],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save('roadmap.pdf');
  };

  if (!isVisible) return null;

  return (
    <div className="flex-1 h-screen roadmap-enter">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-2.5 border-b border-border bg-card-glass">
          <h2 className="text-xl font-semibold">Learning Roadmap</h2>
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
        
        <div className="flex-1" id="roadmap-flow-container">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{
              padding: 0.8, // Less padding for tighter centering
              minZoom: 0.5, // Prevent zooming out too far
                maxZoom: 1.5, // Limit max zoom-in level
            }}
            attributionPosition="bottom-left"
             style={{ width: '100%', height: '100%' }}
          >
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={20} 
              size={1}
              color="hsl(250 84% 54% / 0.1)"
            />
            <Controls 
              className="bg-card-glass border border-border rounded-lg"
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

// Mock API function - simulates backend call
async function getMockRoadmapData(prompt: string) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate roadmap based on prompt keywords
  const isReactPrompt = prompt.toLowerCase().includes('react');
  const isDataSciencePrompt = prompt.toLowerCase().includes('data science');
  
  if (isReactPrompt) {
    return {
      skills: [
        {
          id: '1',
          title: 'JavaScript Fundamentals',
          level: 'Beginner',
          duration: '2-3 weeks',
          description: 'Master ES6+, async/await, modules, and modern JavaScript concepts.',
          progress: 100,
          completed: true,
          resources: [
            { title: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' },
            { title: 'JavaScript.info', url: 'https://javascript.info/' }
          ]
        },
        {
          id: '2',
          title: 'React Basics',
          level: 'Beginner',
          duration: '3-4 weeks',
          description: 'Learn components, JSX, props, state, and event handling.',
          progress: 60,
          completed: false,
          resources: [
            { title: 'React Official Tutorial', url: 'https://reactjs.org/tutorial/tutorial.html' },
            { title: 'React Beta Docs', url: 'https://beta.reactjs.org/' }
          ]
        },
        {
          id: '3',
          title: 'React Hooks',
          level: 'Intermediate',
          duration: '2-3 weeks',
          description: 'Master useState, useEffect, useContext, and custom hooks.',
          progress: 0,
          completed: false,
          resources: [
            { title: 'React Hooks Guide', url: 'https://reactjs.org/docs/hooks-intro.html' }
          ]
        },
        {
          id: '4',
          title: 'State Management',
          level: 'Intermediate',
          duration: '2-3 weeks',
          description: 'Learn Redux, Zustand, or Context API for complex state management.',
          progress: 0,
          completed: false,
          resources: [
            { title: 'Redux Toolkit', url: 'https://redux-toolkit.js.org/' }
          ]
        },
        {
          id: '5',
          title: 'Testing',
          level: 'Intermediate',
          duration: '1-2 weeks',
          description: 'Unit testing with Jest and React Testing Library.',
          progress: 0,
          completed: false,
          resources: [
            { title: 'Testing Library', url: 'https://testing-library.com/' }
          ]
        },
        {
          id: '6',
          title: 'Production Deployment',
          level: 'Advanced',
          duration: '1 week',
          description: 'Deploy React apps to production with optimization.',
          progress: 0,
          completed: false,
          resources: [
            { title: 'Vercel', url: 'https://vercel.com/' },
            { title: 'Netlify', url: 'https://netlify.com/' }
          ]
        }
      ],
      connections: [
        { from: '1', to: '2' },
        { from: '2', to: '3' },
        { from: '3', to: '4' },
        { from: '2', to: '5' },
        { from: '4', to: '6' },
        { from: '5', to: '6' }
      ]
    };
  }
  
  // Default generic roadmap
  return {
    skills: [
      {
        id: '1',
        title: 'Fundamentals',
        level: 'Beginner',
        duration: '2-4 weeks',
        description: 'Build a strong foundation in core concepts.',
        progress: 0,
        completed: false,
        resources: [
          { title: 'Getting Started Guide', url: '#' }
        ]
      },
      {
        id: '2',
        title: 'Intermediate Concepts',
        level: 'Intermediate',
        duration: '4-6 weeks',
        description: 'Dive deeper into advanced topics and practical applications.',
        progress: 0,
        completed: false,
        resources: [
          { title: 'Advanced Tutorial', url: '#' }
        ]
      },
      {
        id: '3',
        title: 'Advanced Practice',
        level: 'Advanced',
        duration: '6-8 weeks',
        description: 'Apply your knowledge to real-world projects.',
        progress: 0,
        completed: false,
        resources: [
          { title: 'Project Ideas', url: '#' }
        ]
      }
    ],
    connections: [
      { from: '1', to: '2' },
      { from: '2', to: '3' }
    ]
  };
}