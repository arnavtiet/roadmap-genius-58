import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Target, TrendingUp, Users, BookOpen, Award, Upload, Zap } from 'lucide-react';
import { SkillsAnalysis } from './SkillsAnalysis';
import { LearningRoadmap } from './LearningRoadmap';
import { ProgressTracking } from './ProgressTracking';

export const Dashboard = () => {
  const overallProgress = 68;
  const activeGoals = 3;
  const completedCourses = 12;
  const skillsGap = 8;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="gradient-primary p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">SkillForge AI</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Learning Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Resume
              </Button>
              <Button className="btn-gradient gap-2">
                <Zap className="h-4 w-4" />
                Generate Roadmap
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, Sarah!</h2>
          <p className="text-muted-foreground">Your personalized learning journey continues. Let's achieve your goals together.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-hover animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{overallProgress}%</div>
              <Progress value={overallProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="card-hover animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{activeGoals}</div>
              <p className="text-xs text-muted-foreground mt-2">2 in progress, 1 planned</p>
            </CardContent>
          </Card>

          <Card className="card-hover animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{completedCourses}</div>
              <p className="text-xs text-muted-foreground mt-2">3 certifications earned</p>
            </CardContent>
          </Card>

          <Card className="card-hover animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skills Gap</CardTitle>
              <Award className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{skillsGap}</div>
              <p className="text-xs text-muted-foreground mt-2">Areas to focus on</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Goal Banner */}
        <Card className="gradient-primary text-white mb-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2">Current Goal: Data Scientist</h3>
                <p className="text-blue-100 mb-4">
                  You're 68% through your journey to becoming a Data Scientist. Keep up the excellent progress!
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    Machine Learning
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    Python
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    Statistics
                  </Badge>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">68%</div>
                <Progress value={68} className="w-32" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skills Analysis - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <SkillsAnalysis />
          </div>
          
          {/* Progress Tracking - Takes up 1 column */}
          <div>
            <ProgressTracking />
          </div>
        </div>

        {/* Learning Roadmap - Full width */}
        <div className="mt-8">
          <LearningRoadmap />
        </div>
      </main>
    </div>
  );
};