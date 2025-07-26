'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Target, Calendar, CalendarDays, CalendarRange } from 'lucide-react';
import { Activity } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface GoalSettingsDialogProps {
  activity: Activity;
  onGoalsUpdate?: (activityId: string, newGoals: Activity['goals']) => void;
}

export default function GoalSettingsDialog({ activity, onGoalsUpdate }: GoalSettingsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [goals, setGoals] = useState(activity.goals);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoalChange = (period: keyof Activity['goals'], value: string) => {
    const numValue = parseInt(value) || 0;
    setGoals(prev => ({
      ...prev,
      [period]: numValue
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call when backend endpoint is available
      // const response = await fetch(`/api/activities/${activity.id}/goals`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ goals })
      // });
      
      // For now, just simulate the update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onGoalsUpdate?.(activity.id, goals);
      
      toast({
        title: "Goals Updated",
        description: `${activity.name} goals have been updated successfully!`,
      });
      
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update goals. This feature requires backend API support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setGoals(activity.goals);
  };

  const getRecommendedGoals = () => {
    const baseDaily = activity.goals.daily;
    return {
      daily: baseDaily,
      weekly: baseDaily * 7,
      monthly: baseDaily * 30,
      yearly: baseDaily * 365
    };
  };

  const recommended = getRecommendedGoals();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Set Goals
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Set Goals for {activity.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Progress Overview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Current Progress</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <div className="grid grid-cols-2 gap-2">
                <div>Current Reps: <span className="font-semibold text-foreground">{activity.reps}</span></div>
                <div>Daily Goal: <span className="font-semibold text-foreground">{activity.goals.daily}</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Goal Setting Form */}
          <div className="space-y-4">
            {/* Daily Goal */}
            <div className="space-y-2">
              <Label htmlFor="daily" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Daily Goal
              </Label>
              <Input
                id="daily"
                type="number"
                min="0"
                value={goals.daily}
                onChange={(e) => handleGoalChange('daily', e.target.value)}
                placeholder="Enter daily goal"
              />
              <p className="text-xs text-muted-foreground">
                Recommended: {recommended.daily} {activity.name === 'Focus Hour' ? 'minutes' : 'reps'}
              </p>
            </div>

            {/* Weekly Goal */}
            <div className="space-y-2">
              <Label htmlFor="weekly" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Weekly Goal
              </Label>
              <Input
                id="weekly"
                type="number"
                min="0"
                value={goals.weekly}
                onChange={(e) => handleGoalChange('weekly', e.target.value)}
                placeholder="Enter weekly goal"
              />
              <p className="text-xs text-muted-foreground">
                Recommended: {recommended.weekly} (Daily × 7)
              </p>
            </div>

            {/* Monthly Goal */}
            <div className="space-y-2">
              <Label htmlFor="monthly" className="flex items-center gap-2">
                <CalendarRange className="h-4 w-4" />
                Monthly Goal
              </Label>
              <Input
                id="monthly"
                type="number"
                min="0"
                value={goals.monthly}
                onChange={(e) => handleGoalChange('monthly', e.target.value)}
                placeholder="Enter monthly goal"
              />
              <p className="text-xs text-muted-foreground">
                Recommended: {recommended.monthly} (Daily × 30)
              </p>
            </div>

            {/* Yearly Goal */}
            <div className="space-y-2">
              <Label htmlFor="yearly" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Yearly Goal
              </Label>
              <Input
                id="yearly"
                type="number"
                min="0"
                value={goals.yearly}
                onChange={(e) => handleGoalChange('yearly', e.target.value)}
                placeholder="Enter yearly goal"
              />
              <p className="text-xs text-muted-foreground">
                Recommended: {recommended.yearly} (Daily × 365)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}
              className="flex-1"
            >
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Saving...' : 'Save Goals'}
            </Button>
          </div>

          {/* Note about backend support */}
          <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
            <strong>Note:</strong> Goal setting requires backend API support. Currently, this is a UI preview that simulates the functionality.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}