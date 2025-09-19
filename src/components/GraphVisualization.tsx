/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { CourseNode } from './CourseNode';

interface GraphVisualizationProps {
  roadmap: any;
  isGenerating: boolean;
}

export const GraphVisualization: React.FC<GraphVisualizationProps> = ({ 
  roadmap, 
  isGenerating 
}) => {
  const [visibleNodes, setVisibleNodes] = useState<string[]>([]);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (roadmap && !isGenerating) {
      // Animate nodes appearing one by one
      setVisibleNodes([]);
      setAnimationComplete(false);
      
      const animateNodes = (nodes: any[], delay = 0) => {
        nodes.forEach((node, index) => {
          setTimeout(() => {
            setVisibleNodes(prev => [...prev, node.id]);
            if (node.children && node.children.length > 0) {
              // Animate children with additional delay
              animateNodes(node.children, 300);
            }
          }, delay + index * 200);
        });
      };

      // Start animation
      setTimeout(() => {
        animateNodes([roadmap]);
        // Mark animation as complete after all nodes should be visible
        setTimeout(() => setAnimationComplete(true), 2000);
      }, 500);
    }
  }, [roadmap, isGenerating]);

  const renderNode = (node: any, level = 0, parentX = 0, parentY = 0) => {
    const isVisible = visibleNodes.includes(node.id);
    // Vertical layout: x stays centered, y increases with level
    const nodeWidth = 250;
    const nodeHeight = 100;
    const levelSpacing = 200;
    const siblingSpacing = 300;
    
    // Calculate positions for vertical flow
    const x = parentX + (node.index || 0) * siblingSpacing;
    const y = level * levelSpacing;

    return (
      <g key={node.id}>
        {/* Connection line from parent */}
        {level > 0 && isVisible && (
          <line
            x1={parentX + nodeWidth / 2}
            y1={parentY + nodeHeight}
            x2={x + nodeWidth / 2}
            y2={y}
            stroke="hsl(var(--border))"
            strokeWidth="3"
            strokeDasharray="5,5"
            className="animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          />
        )}
        
        {/* Node */}
        <CourseNode
          node={node}
          x={x}
          y={y}
          isVisible={isVisible}
          level={level}
        />

        {/* Render children */}
        {node.children?.map((child: any, index: number) => {
          const childNode = { ...child, index };
          const childrenCount = node.children.length;
          const startOffset = -(childrenCount - 1) * siblingSpacing / 2;
          const childX = x + startOffset + index * siblingSpacing;
          return renderNode(childNode, level + 1, childX, y);
        })}
      </g>
    );
  };

  if (!roadmap) return null;

  // Calculate SVG dimensions based on the tree structure
  const calculateDimensions = (node: any, level = 0): { width: number; height: number } => {
    const nodeWidth = 250;
    const levelSpacing = 200;
    const siblingSpacing = 300;
    
    let maxWidth = nodeWidth;
    let maxHeight = (level + 1) * levelSpacing + 100;

    if (node.children && node.children.length > 0) {
      // Calculate width based on children spread
      const childrenWidth = node.children.length * siblingSpacing;
      maxWidth = Math.max(maxWidth, childrenWidth);
      
      node.children.forEach((child: any) => {
        const childDims = calculateDimensions(child, level + 1);
        maxWidth = Math.max(maxWidth, childDims.width);
        maxHeight = Math.max(maxHeight, childDims.height);
      });
    }

    return { width: maxWidth + 400, height: maxHeight };
  };

  const { width, height } = calculateDimensions(roadmap);

  return (
    <div className="w-full h-full flex flex-col bg-background p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Learning Roadmap: {roadmap.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          Click on nodes to expand and see more details. Scroll to explore the full roadmap.
        </p>
      </div>

      <div className="flex-1 border rounded-lg bg-card overflow-hidden">
        <div className="w-full h-full overflow-auto p-4" style={{ scrollBehavior: 'smooth' }}>
          <svg
            width={Math.max(width, 1000)}
            height={Math.max(height, 800)}
            className="mx-auto block"
            viewBox={`0 0 ${Math.max(width, 1000)} ${Math.max(height, 800)}`}
          >
            {/* Grid pattern background */}
            <defs>
              <pattern
                id="grid"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 30 0 L 0 0 0 30"
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="0.5"
                  opacity="0.2"
                />
              </pattern>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Center the root node */}
            <g transform={`translate(${Math.max(width, 1000) / 2 - 125}, 50)`}>
              {renderNode(roadmap)}
            </g>

            {/* Loading animation overlay */}
            {isGenerating && (
              <g>
                <rect
                  width="100%"
                  height="100%"
                  fill="hsl(var(--background))"
                  opacity="0.9"
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  className="text-lg font-medium fill-foreground animate-pulse"
                >
                  Generating your learning roadmap...
                </text>
                <circle
                  cx="50%"
                  cy="60%"
                  r="20"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  strokeDasharray="31.416"
                  className="animate-spin"
                  style={{ transformOrigin: '50% 60%' }}
                />
              </g>
            )}
          </svg>
        </div>
      </div>

      {animationComplete && (
        <div className="mt-4 p-3 bg-muted rounded-lg animate-fade-in">
          <p className="text-sm text-muted-foreground">
            🎉 Your roadmap is ready! You can now explore and expand nodes to see detailed learning paths.
          </p>
        </div>
      )}
    </div>
  );
};