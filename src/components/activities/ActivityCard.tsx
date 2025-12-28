'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Timer, Target } from 'lucide-react';
import { Activity, ProgressData } from '@/lib/types';
import { activityApi, transformActivity } from '@/lib/api';
import GoalSettingsDialog from './GoalSettingsDialog';
import { useToast } from '@/hooks/use-toast';

interface ActivityCardProps {
  activity: Activity;
  progress?: ProgressData;
  onUpdate: (updatedActivity: Activity) => void;
}

export default function ActivityCard({ activity, progress, onUpdate }: ActivityCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleIncrement = async () => {
    setIsLoading(true);
    try {
      const updatedActivity = await activityApi.increment(activity.id);
      onUpdate(updatedActivity);
      toast({
        title: "Success",
        description: `${activity.name} reps increased!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reps. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrement = async () => {
    if (activity.reps <= 0) return;
    
    setIsLoading(true);
    try {
      const updatedActivity = await activityApi.decrement(activity.id);
      onUpdate(updatedActivity);
      toast({
        title: "Success",
        description: `${activity.name} reps decreased!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reps. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoalsUpdate = (activityId: string, newGoals: Activity['goals']) => {
    const updatedActivity = { ...activity, goals: newGoals };
    onUpdate(updatedActivity);
  };

  const dailyProgress = progress?.daily_progress;
  const progressPercentage = dailyProgress ? Math.min(dailyProgress.percentage, 100) : 0;
  const isCompleted = progressPercentage >= 100;

  return (
    <Card className={`transition-all duration-200 ${isCompleted ? 'ring-2 ring-green-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{activity.name}</CardTitle>
          <div className="flex items-center gap-2">
            {isCompleted && <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>}
            <GoalSettingsDialog 
              activity={activity} 
              onGoalsUpdate={handleGoalsUpdate}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Reps Display */}
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">
            {activity.reps}
          </div>
          <div className="text-sm text-muted-foreground">
            {activity.name === 'Focus Hour' ? 'minutes' : 'reps'} today
          </div>
        </div>

        {/* Progress Bar */}
        {dailyProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Daily Goal</span>
              <span>{dailyProgress.current} / {dailyProgress.target}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-xs text-muted-foreground text-center">
              {dailyProgress.remaining > 0 
                ? `${dailyProgress.remaining} remaining`
                : 'Goal achieved! 🎉'
              }
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDecrement}
            disabled={isLoading || activity.reps <= 0}
            className="flex-1"
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={handleIncrement}
            disabled={isLoading}
            className="flex-1"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Goals Summary */}
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            <span>Daily: {activity.goals.daily}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            <span>Weekly: {activity.goals.weekly}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}