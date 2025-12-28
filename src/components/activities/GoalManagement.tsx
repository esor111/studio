'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';
import { Activity, ProgressData } from '@/lib/types';
import { activityApi } from '@/lib/api';
import GoalSettingsDialog from './GoalSettingsDialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function GoalManagement() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [progressData, setProgressData] = useState<Record<string, ProgressData>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const fetchedActivities = await activityApi.getAll();
      setActivities(fetchedActivities);
      await fetchProgressData(fetchedActivities);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProgressData = async (activitiesList: Activity[]) => {
    try {
      const progressPromises = activitiesList.map(activity =>
        activityApi.getProgress(activity.id)
          .then(progress => ({ id: activity.id, progress }))
          .catch(() => ({ id: activity.id, progress: null }))
      );
      
      const progressResults = await Promise.all(progressPromises);
      const progressMap: Record<string, ProgressData> = {};
      
      progressResults.forEach(({ id, progress }) => {
        if (progress) {
          progressMap[id] = progress;
        }
      });
      
      setProgressData(progressMap);
    } catch (error) {
      console.error('Failed to fetch progress data:', error);
    }
  };

  const handleGoalsUpdate = (activityId: string, newGoals: Activity['goals']) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, goals: newGoals }
          : activity
      )
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Target className="h-6 w-6" />
          Goal Management
        </h2>
        <p className="text-muted-foreground mt-1">
          Set and track your daily, weekly, monthly, and yearly goals for each activity.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {activities.map(activity => {
          const progress = progressData[activity.id];
          const dailyProgress = progress?.daily_progress;
          const weeklyProgress = progress?.weekly_progress;
          const monthlyProgress = progress?.monthly_progress;
          
          return (
            <Card key={activity.id} className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{activity.name}</CardTitle>
                  <GoalSettingsDialog 
                    activity={activity} 
                    onGoalsUpdate={handleGoalsUpdate}
                  />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Current Status */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current Reps</span>
                  <span className="font-semibold text-2xl text-primary">
                    {activity.reps}
                  </span>
                </div>

                {/* Progress Sections */}
                <div className="space-y-3">
                  {/* Daily Progress */}
                  {dailyProgress && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          Daily Goal
                        </span>
                        <span>{dailyProgress.current} / {dailyProgress.target}</span>
                      </div>
                      <Progress value={Math.min(dailyProgress.percentage, 100)} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{Math.round(dailyProgress.percentage)}% complete</span>
                        <span>{dailyProgress.remaining > 0 ? `${dailyProgress.remaining} remaining` : 'Goal achieved! 🎉'}</span>
                      </div>
                    </div>
                  )}

                  {/* Weekly Progress */}
                  {weeklyProgress && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          Weekly Goal
                        </span>
                        <span>{weeklyProgress.current} / {weeklyProgress.target}</span>
                      </div>
                      <Progress value={Math.min(weeklyProgress.percentage, 100)} className="h-2" />
                      <div className="text-xs text-muted-foreground text-right">
                        {Math.round(weeklyProgress.percentage)}% complete
                      </div>
                    </div>
                  )}

                  {/* Monthly Progress */}
                  {monthlyProgress && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          Monthly Goal
                        </span>
                        <span>{monthlyProgress.current} / {monthlyProgress.target}</span>
                      </div>
                      <Progress value={Math.min(monthlyProgress.percentage, 100)} className="h-2" />
                      <div className="text-xs text-muted-foreground text-right">
                        {Math.round(monthlyProgress.percentage)}% complete
                      </div>
                    </div>
                  )}
                </div>

                {/* Goal Summary */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Weekly</div>
                    <div className="font-semibold">{activity.goals.weekly}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Monthly</div>
                    <div className="font-semibold">{activity.goals.monthly}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-semibold">Goal Setting</h3>
              <p className="text-sm text-muted-foreground">
                Click "Set Goals" on any activity card to customize your daily, weekly, monthly, and yearly targets. 
                Goals help you stay motivated and track your long-term progress.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}