import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Star, 
  Trophy,
  ArrowRight,
  Lightbulb,
  Code,
  Database,
  BarChart3
} from 'lucide-react';

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'project' | 'certification';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'completed' | 'current' | 'upcoming';
  progress: number;
  skills: string[];
  icon: any;
  resources: {
    name: string;
    type: 'video' | 'article' | 'practice';
    duration: string;
  }[];
}

export const LearningRoadmap = () => {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const roadmapSteps: RoadmapStep[] = [
    {
      id: '1',
      title: 'Statistics Fundamentals',
      description: 'Master the statistical foundations essential for data science',
      type: 'course',
      duration: '4 weeks',
      difficulty: 'intermediate',
      status: 'current',
      progress: 60,
      skills: ['Statistics', 'Probability', 'Hypothesis Testing'],
      icon: BarChart3,
      resources: [
        { name: 'Descriptive Statistics', type: 'video', duration: '2h 30m' },
        { name: 'Probability Distributions', type: 'article', duration: '1h 15m' },
        { name: 'A/B Testing Practice', type: 'practice', duration: '3h 00m' }
      ]
    },
    {
      id: '2',
      title: 'Advanced Python for Data Science',
      description: 'Deepen your Python skills with focus on data manipulation',
      type: 'course',
      duration: '3 weeks',
      difficulty: 'intermediate',
      status: 'upcoming',
      progress: 0,
      skills: ['Python', 'Pandas', 'NumPy'],
      icon: Code,
      resources: [
        { name: 'Advanced Pandas Techniques', type: 'video', duration: '4h 00m' },
        { name: 'Data Cleaning Masterclass', type: 'practice', duration: '6h 00m' }
      ]
    },
    {
      id: '3',
      title: 'Machine Learning Project',
      description: 'Build an end-to-end ML model for customer segmentation',
      type: 'project',
      duration: '2 weeks',
      difficulty: 'advanced',
      status: 'upcoming',
      progress: 0,
      skills: ['Machine Learning', 'Scikit-learn', 'Feature Engineering'],
      icon: Lightbulb,
      resources: [
        { name: 'Project Requirements', type: 'article', duration: '30m' },
        { name: 'Implementation Guide', type: 'video', duration: '5h 00m' }
      ]
    },
    {
      id: '4',
      title: 'Deep Learning Specialization',
      description: 'Neural networks and deep learning fundamentals',
      type: 'course',
      duration: '6 weeks',
      difficulty: 'advanced',
      status: 'upcoming',
      progress: 0,
      skills: ['Deep Learning', 'TensorFlow', 'Neural Networks'],
      icon: Database,
      resources: [
        { name: 'Neural Network Basics', type: 'video', duration: '8h 00m' },
        { name: 'TensorFlow Hands-on', type: 'practice', duration: '12h 00m' }
      ]
    },
    {
      id: '5',
      title: 'Data Science Certification',
      description: 'Professional certification to validate your skills',
      type: 'certification',
      duration: '1 week',
      difficulty: 'advanced',
      status: 'upcoming',
      progress: 0,
      skills: ['All Skills'],
      icon: Trophy,
      resources: [
        { name: 'Exam Preparation', type: 'article', duration: '4h 00m' },
        { name: 'Practice Tests', type: 'practice', duration: '6h 00m' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'current':
        return 'bg-primary text-primary-foreground animate-pulse-glow';
      case 'upcoming':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course':
        return BookOpen;
      case 'project':
        return Lightbulb;
      case 'certification':
        return Trophy;
      default:
        return BookOpen;
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

  return (
    <Card className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="gradient-primary p-2 rounded-lg">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          Learning Roadmap: Data Scientist
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your personalized path to becoming a Data Scientist
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {roadmapSteps.map((step, index) => {
            const StepIcon = step.icon;
            const TypeIcon = getTypeIcon(step.type);
            const isSelected = selectedStep === step.id;

            return (
              <div key={step.id} className="relative">
                {/* Connection Line */}
                {index < roadmapSteps.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-8 bg-border"></div>
                )}

                <div 
                  className={`flowchart-node cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedStep(isSelected ? null : step.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* Step Icon */}
                    <div className={`p-3 rounded-lg ${getStatusColor(step.status)}`}>
                      <StepIcon className="h-5 w-5" />
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-base">{step.title}</h3>
                        <Badge variant="outline" className={getDifficultyColor(step.difficulty)}>
                          {step.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          <TypeIcon className="h-3 w-3 mr-1" />
                          {step.type}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {step.description}
                      </p>

                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {step.duration}
                        </div>
                        {step.status === 'current' && (
                          <div className="flex-1 max-w-xs">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{step.progress}%</span>
                            </div>
                            <Progress value={step.progress} className="h-2" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {step.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center justify-between">
                        <Button 
                          variant={step.status === 'current' ? 'default' : 'outline'}
                          size="sm"
                          className={step.status === 'current' ? 'btn-gradient' : ''}
                        >
                          {step.status === 'completed' && <CheckCircle className="h-4 w-4 mr-2" />}
                          {step.status === 'current' && <Play className="h-4 w-4 mr-2" />}
                          {step.status === 'upcoming' && <Clock className="h-4 w-4 mr-2" />}
                          {step.status === 'completed' ? 'Completed' : 
                           step.status === 'current' ? 'Continue' : 'Start'}
                        </Button>
                        
                        <Button variant="ghost" size="sm">
                          View Details
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>

                      {/* Expanded Resources */}
                      {isSelected && (
                        <div className="mt-4 pt-4 border-t animate-fade-in-up">
                          <h4 className="font-medium mb-3">Learning Resources</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {step.resources.map((resource, resourceIndex) => (
                              <div key={resourceIndex} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                <div className="p-2 bg-primary/10 rounded">
                                  {resource.type === 'video' && <Play className="h-4 w-4 text-primary" />}
                                  {resource.type === 'article' && <BookOpen className="h-4 w-4 text-primary" />}
                                  {resource.type === 'practice' && <Code className="h-4 w-4 text-primary" />}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{resource.name}</div>
                                  <div className="text-xs text-muted-foreground">{resource.duration}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Roadmap Summary */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-foreground">15 weeks</div>
              <div className="text-xs text-muted-foreground">Total Duration</div>
            </div>
            <div>
              <div className="text-xl font-bold text-success">1</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-xl font-bold text-primary">1</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
            <div>
              <div className="text-xl font-bold text-muted-foreground">3</div>
              <div className="text-xs text-muted-foreground">Upcoming</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};