import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  Award, 
  Clock,
  CheckCircle2,
  Star,
  Flame
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'course' | 'skill' | 'project' | 'milestone';
  icon: any;
}

interface WeeklyGoal {
  id: string;
  title: string;
  progress: number;
  target: number;
  unit: string;
}

export const ProgressTracking = () => {
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'SQL Master',
      description: 'Completed advanced SQL course',
      date: '2 days ago',
      type: 'course',
      icon: Award
    },
    {
      id: '2',
      title: 'First ML Model',
      description: 'Built and deployed first machine learning model',
      date: '1 week ago',
      type: 'project',
      icon: Star
    },
    {
      id: '3',
      title: 'Python Proficient',
      description: 'Achieved 85% proficiency in Python',
      date: '2 weeks ago',
      type: 'skill',
      icon: TrendingUp
    },
    {
      id: '4',
      title: '30-Day Streak',
      description: 'Maintained learning streak for 30 days',
      date: '3 weeks ago',
      type: 'milestone',
      icon: Flame
    }
  ];

  const weeklyGoals: WeeklyGoal[] = [
    {
      id: '1',
      title: 'Study Hours',
      progress: 12,
      target: 15,
      unit: 'hours'
    },
    {
      id: '2',
      title: 'Exercises Completed',
      progress: 8,
      target: 10,
      unit: 'exercises'
    },
    {
      id: '3',
      title: 'Video Lessons',
      progress: 5,
      target: 6,
      unit: 'lessons'
    }
  ];

  const learningStreak = 34;
  const totalHours = 156;
  const certificationsEarned = 3;

  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'course':
        return 'bg-primary/10 text-primary';
      case 'skill':
        return 'bg-success/10 text-success';
      case 'project':
        return 'bg-accent/10 text-accent';
      case 'milestone':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Learning Stats */}
      <Card className="animate-slide-in-right">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="gradient-primary p-2 rounded-lg">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            Learning Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="h-5 w-5 text-warning" />
              <span className="text-2xl font-bold text-foreground">{learningStreak}</span>
            </div>
            <p className="text-sm text-muted-foreground">Day Learning Streak</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">{totalHours}h</div>
              <p className="text-xs text-muted-foreground">Total Hours</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">{certificationsEarned}</div>
              <p className="text-xs text-muted-foreground">Certifications</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Goals */}
      <Card className="animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-4 w-4 text-primary" />
            Weekly Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {weeklyGoals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{goal.title}</span>
                <span className="text-sm text-muted-foreground">
                  {goal.progress}/{goal.target} {goal.unit}
                </span>
              </div>
              <Progress value={(goal.progress / goal.target) * 100} className="h-2" />
            </div>
          ))}
          
          <Button className="w-full mt-4" variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            View Full Calendar
          </Button>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card className="animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="h-4 w-4 text-accent" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {achievements.slice(0, 3).map((achievement) => {
            const IconComponent = achievement.icon;
            return (
              <div key={achievement.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className={`p-2 rounded-lg ${getAchievementColor(achievement.type)}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{achievement.title}</div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {achievement.description}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {achievement.date}
                  </div>
                </div>
              </div>
            );
          })}
          
          <Button className="w-full mt-4" variant="outline" size="sm">
            View All Achievements
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full btn-gradient" size="sm">
            Continue Current Course
          </Button>
          <Button className="w-full" variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Study Session
          </Button>
          <Button className="w-full" variant="outline" size="sm">
            <Target className="h-4 w-4 mr-2" />
            Set New Goal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};