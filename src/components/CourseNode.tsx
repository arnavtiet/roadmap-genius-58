/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, CheckCircle, Clock } from 'lucide-react';

interface CourseNodeProps {
  node: any;
  x: number;
  y: number;
  isVisible: boolean;
  level: number;
}

export const CourseNode: React.FC<CourseNodeProps> = ({ 
  node, 
  x, 
  y, 
  isVisible, 
  level 
}) => {
  const [isExpanded, setIsExpanded] = useState(level === 0); // Root node expanded by default
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isVisible) return null;

  const nodeWidth = 200;
  const nodeHeight = 80;

  const getNodeColor = () => {
    switch (node.difficulty) {
      case 'Beginner':
        return 'hsl(var(--accent))';
      case 'Intermediate':
        return 'hsl(var(--secondary))';
      case 'Advanced':
        return 'hsl(var(--destructive))';
      default:
        return 'hsl(var(--primary))';
    }
  };

  const handleNodeClick = () => {
    if (node.children && node.children.length > 0) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleCompleteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCompleted(!isCompleted);
  };

  return (
    <g 
      className="animate-scale-in cursor-pointer transition-all duration-200 hover:opacity-80"
      style={{ animationDelay: `${level * 0.2}s` }}
    >
      {/* Node background */}
      <rect
        x={x}
        y={y}
        width={nodeWidth}
        height={nodeHeight}
        rx="8"
        fill={isCompleted ? 'hsl(var(--muted))' : getNodeColor()}
        stroke={isCompleted ? 'hsl(var(--border))' : 'transparent'}
        strokeWidth="2"
        onClick={handleNodeClick}
        className="transition-all duration-200"
      />

      {/* Node content */}
      <foreignObject x={x + 8} y={y + 8} width={nodeWidth - 16} height={nodeHeight - 16}>
        <div className="h-full flex flex-col justify-between p-2 text-xs">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium truncate ${
                isCompleted ? 'text-muted-foreground line-through' : 'text-card-foreground'
              }`}>
                {node.title}
              </h4>
              <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                {node.description}
              </p>
            </div>
            
            {/* Expand/Collapse icon */}
            {node.children && node.children.length > 0 && (
              <div className="ml-2 flex-shrink-0">
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
            )}
          </div>

          {/* Node metadata */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">{node.duration}</span>
              </div>
              
              {node.difficulty && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                  node.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                  node.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {node.difficulty}
                </span>
              )}
            </div>

            {/* Completion toggle */}
            <button
              onClick={handleCompleteToggle}
              className="p-1 hover:bg-background/20 rounded transition-colors"
            >
              {isCompleted ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <div className="h-4 w-4 border-2 border-current rounded-full opacity-50" />
              )}
            </button>
          </div>
        </div>
      </foreignObject>

      {/* Connection points for children */}
      {node.children && node.children.length > 0 && isExpanded && (
        <circle
          cx={x + nodeWidth}
          cy={y + nodeHeight / 2}
          r="3"
          fill="hsl(var(--border))"
          className="animate-fade-in"
        />
      )}

      {/* Progress indicator */}
      {node.progress && (
        <g>
          <rect
            x={x}
            y={y + nodeHeight - 3}
            width={nodeWidth}
            height="3"
            fill="hsl(var(--muted))"
            rx="1.5"
          />
          <rect
            x={x}
            y={y + nodeHeight - 3}
            width={(nodeWidth * node.progress) / 100}
            height="3"
            fill="hsl(var(--primary))"
            rx="1.5"
            className="animate-fade-in"
          />
        </g>
      )}
    </g>
  );
};