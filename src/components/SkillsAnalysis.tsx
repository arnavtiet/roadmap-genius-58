import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, TrendingUp, AlertCircle } from 'lucide-react';

interface Skill {
  name: string;
  level: number;
  required: number;
  status: 'mastered' | 'progressing' | 'gap';
  category: string;
}

export const SkillsAnalysis = () => {
  const skills: Skill[] = [
    { name: 'Python Programming', level: 85, required: 90, status: 'progressing', category: 'Programming' },
    { name: 'Machine Learning', level: 70, required: 85, status: 'progressing', category: 'AI/ML' },
    { name: 'SQL', level: 95, required: 80, status: 'mastered', category: 'Database' },
    { name: 'Statistics', level: 60, required: 85, status: 'gap', category: 'Mathematics' },
    { name: 'Data Visualization', level: 75, required: 75, status: 'mastered', category: 'Analytics' },
    { name: 'Deep Learning', level: 30, required: 70, status: 'gap', category: 'AI/ML' },
    { name: 'Pandas', level: 80, required: 80, status: 'mastered', category: 'Programming' },
    { name: 'TensorFlow', level: 45, required: 75, status: 'gap', category: 'AI/ML' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'mastered':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'progressing':
        return <TrendingUp className="h-4 w-4 text-primary" />;
      case 'gap':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mastered':
        return 'bg-success/10 text-success border-success/20';
      case 'progressing':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'gap':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const categories = [...new Set(skills.map(skill => skill.category))];

  return (
    <Card className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="gradient-primary p-2 rounded-lg">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          Skills Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Current skills vs. Data Scientist requirements
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category} className="space-y-3">
              <h4 className="font-semibold text-foreground text-sm">{category}</h4>
              <div className="space-y-3">
                {skills
                  .filter(skill => skill.category === category)
                  .map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(skill.status)}
                          <span className="font-medium text-sm">{skill.name}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getStatusColor(skill.status)}`}
                          >
                            {skill.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {skill.level}% / {skill.required}%
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Progress 
                            value={skill.level} 
                            className="h-2"
                          />
                        </div>
                        <div className="flex-1">
                          <Progress 
                            value={skill.required} 
                            className="h-2 opacity-50"
                          />
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Current Level</span>
                        <span>Required Level</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-success">
                {skills.filter(s => s.status === 'mastered').length}
              </div>
              <div className="text-xs text-muted-foreground">Mastered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {skills.filter(s => s.status === 'progressing').length}
              </div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">
                {skills.filter(s => s.status === 'gap').length}
              </div>
              <div className="text-xs text-muted-foreground">Skill Gaps</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};