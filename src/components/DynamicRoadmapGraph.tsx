import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Code, 
  Database, 
  BarChart3, 
  Brain, 
  Award, 
  CheckCircle, 
  Clock, 
  Play,
  ArrowDown,
  Zap
} from 'lucide-react';

interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  type: 'foundation' | 'skill' | 'project' | 'certification';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'upcoming' | 'current' | 'completed';
  skills: string[];
  icon: any;
  prerequisites?: string[];
}

interface DynamicRoadmapGraphProps {
  goal: string;
}

export const DynamicRoadmapGraph = ({ goal }: DynamicRoadmapGraphProps) => {
  const [roadmapNodes, setRoadmapNodes] = useState<RoadmapNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate roadmap based on goal - Replace with actual API call
  const generateRoadmap = (goalType: string): RoadmapNode[] => {
    if (goalType === 'Data Scientist') {
      return [
        {
          id: '1',
          title: 'Mathematics & Statistics Foundation',
          description: 'Build strong mathematical foundation essential for data science',
          type: 'foundation',
          duration: '6 weeks',
          difficulty: 'intermediate',
          status: 'upcoming',
          skills: ['Linear Algebra', 'Calculus', 'Statistics', 'Probability'],
          icon: BarChart3
        },
        {
          id: '2',
          title: 'Python Programming Mastery',
          description: 'Master Python for data analysis and manipulation',
          type: 'skill',
          duration: '4 weeks',
          difficulty: 'beginner',
          status: 'upcoming',
          skills: ['Python', 'Pandas', 'NumPy', 'Data Structures'],
          icon: Code,
          prerequisites: ['1']
        },
        {
          id: '3',
          title: 'Data Analysis & Visualization',
          description: 'Learn to analyze and visualize data effectively',
          type: 'skill',
          duration: '5 weeks',
          difficulty: 'intermediate',
          status: 'upcoming',
          skills: ['Matplotlib', 'Seaborn', 'Plotly', 'Statistical Analysis'],
          icon: BarChart3,
          prerequisites: ['2']
        },
        {
          id: '4',
          title: 'Machine Learning Fundamentals',
          description: 'Understand core ML algorithms and techniques',
          type: 'skill',
          duration: '8 weeks',
          difficulty: 'intermediate',
          status: 'upcoming',
          skills: ['Scikit-learn', 'Supervised Learning', 'Unsupervised Learning'],
          icon: Brain,
          prerequisites: ['3']
        },
        {
          id: '5',
          title: 'Customer Segmentation Project',
          description: 'Build end-to-end ML project for customer analysis',
          type: 'project',
          duration: '3 weeks',
          difficulty: 'intermediate',
          status: 'upcoming',
          skills: ['Feature Engineering', 'Model Selection', 'Data Pipeline'],
          icon: Database,
          prerequisites: ['4']
        },
        {
          id: '6',
          title: 'Deep Learning & Neural Networks',
          description: 'Advanced AI techniques with TensorFlow',
          type: 'skill',
          duration: '10 weeks',
          difficulty: 'advanced',
          status: 'upcoming',
          skills: ['TensorFlow', 'Keras', 'Neural Networks', 'CNN', 'RNN'],
          icon: Brain,
          prerequisites: ['5']
        },
        {
          id: '7',
          title: 'Professional Data Science Certification',
          description: 'Industry-recognized certification to validate skills',
          type: 'certification',
          duration: '2 weeks',
          difficulty: 'advanced',
          status: 'upcoming',
          skills: ['Portfolio Development', 'Interview Preparation'],
          icon: Award,
          prerequisites: ['6']
        }
      ];
    }

    // Default roadmap for other goals
    return [
      {
        id: '1',
        title: 'Foundation Skills',
        description: 'Build the fundamental skills needed for your career path',
        type: 'foundation',
        duration: '4 weeks',
        difficulty: 'beginner',
        status: 'upcoming',
        skills: ['Problem Solving', 'Critical Thinking'],
        icon: BookOpen
      },
      {
        id: '2',
        title: 'Core Technology Stack',
        description: 'Master the key technologies in your field',
        type: 'skill',
        duration: '8 weeks',
        difficulty: 'intermediate',
        status: 'upcoming',
        skills: ['Primary Tools', 'Best Practices'],
        icon: Code,
        prerequisites: ['1']
      },
      {
        id: '3',
        title: 'Hands-on Project',
        description: 'Apply your skills in a real-world project',
        type: 'project',
        duration: '4 weeks',
        difficulty: 'intermediate',
        status: 'upcoming',
        skills: ['Project Management', 'Implementation'],
        icon: Database,
        prerequisites: ['2']
      },
      {
        id: '4',
        title: 'Professional Certification',
        description: 'Earn industry recognition for your expertise',
        type: 'certification',
        duration: '2 weeks',
        difficulty: 'advanced',
        status: 'upcoming',
        skills: ['Certification Prep', 'Portfolio'],
        icon: Award,
        prerequisites: ['3']
      }
    ];
  };

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const generatedRoadmap = generateRoadmap(goal);
      setRoadmapNodes(generatedRoadmap);
      setIsLoading(false);
    }, 1500);
  }, [goal]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'foundation':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'skill':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'project':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'certification':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-success/10 text-success border-success/20';
      case 'intermediate':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'advanced':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const totalDuration = roadmapNodes.reduce((acc, node) => {
    const weeks = parseInt(node.duration.split(' ')[0]);
    return acc + weeks;
  }, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin gradient-primary p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Generating Your Roadmap</h3>
            <p className="text-sm text-muted-foreground">
              AI is creating a personalized learning path for {goal}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full overflow-y-auto">
      {/* Roadmap Header */}
      <div className="text-center pb-4 border-b">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Your {goal} Learning Path
        </h3>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {totalDuration} weeks total
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {roadmapNodes.length} learning modules
          </div>
        </div>
      </div>

      {/* Roadmap Nodes */}
      <div className="space-y-4">
        {roadmapNodes.map((node, index) => {
          const NodeIcon = node.icon;
          
          return (
            <div key={node.id} className="relative">
              {/* Connection Line */}
              {index < roadmapNodes.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-8 bg-border z-0"></div>
              )}

              <Card className="flowchart-node card-hover relative z-10">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Node Icon */}
                    <div className="gradient-primary p-3 rounded-lg shrink-0">
                      <NodeIcon className="h-5 w-5 text-white" />
                    </div>

                    {/* Node Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h4 className="font-semibold text-base text-foreground">{node.title}</h4>
                        <div className="flex gap-1">
                          <Badge variant="outline" className={getTypeColor(node.type)}>
                            {node.type}
                          </Badge>
                          <Badge variant="outline" className={getDifficultyColor(node.difficulty)}>
                            {node.difficulty}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {node.description}
                      </p>

                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {node.duration}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {node.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="gap-2">
                          <Play className="h-4 w-4" />
                          Start Learning
                        </Button>
                        <Button size="sm" variant="ghost">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Arrow Connector */}
              {index < roadmapNodes.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowDown className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Summary */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="text-center">
            <h4 className="font-semibold mb-2">Roadmap Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-lg font-bold text-primary">{totalDuration}</div>
                <div className="text-muted-foreground">Total Weeks</div>
              </div>
              <div>
                <div className="text-lg font-bold text-accent">{roadmapNodes.length}</div>
                <div className="text-muted-foreground">Learning Modules</div>
              </div>
            </div>
            <Button className="w-full mt-4 btn-gradient" size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Start Your Journey
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};