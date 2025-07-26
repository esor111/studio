'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Square, Timer, AlertCircle } from 'lucide-react';
import { Activity } from '@/lib/types';
import { activityApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface TimerCardProps {
  activity: Activity;
  onUpdate: (updatedActivity: Activity) => void;
}

export default function TimerCard({ activity, onUpdate }: TimerCardProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timerAvailable, setTimerAvailable] = useState(false);
  const { toast } = useToast();

  // Check if timer endpoints are available on mount
  useEffect(() => {
    checkTimerAvailability();
  }, [activity.id]);

  // Update elapsed time every second when timer is running
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const checkTimerAvailability = async () => {
    try {
      // Try to check if timer endpoints exist
      const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVITY_API_URL}/activities/${activity.id}/timer`);
      setTimerAvailable(response.ok);
    } catch (error) {
      console.log('Timer endpoints not available, using manual timer');
      setTimerAvailable(false);
    }
  };

  const handleStartTimer = async () => {
    setIsLoading(true);
    
    if (timerAvailable) {
      // Try backend timer first
      try {
        const { timerApi } = await import('@/lib/api');
        await timerApi.start(activity.id);
        setIsRunning(true);
        setStartTime(new Date());
        setElapsedTime(0);
        toast({
          title: "Timer Started",
          description: `${activity.name} session started!`,
        });
      } catch (error) {
        console.error('Backend timer failed, falling back to manual timer');
        startManualTimer();
      }
    } else {
      // Use manual timer
      startManualTimer();
    }
    
    setIsLoading(false);
  };

  const startManualTimer = () => {
    setIsRunning(true);
    setStartTime(new Date());
    setElapsedTime(0);
    toast({
      title: "Manual Timer Started",
      description: `${activity.name} session started! Click stop when finished.`,
    });
  };

  const handleStopTimer = async () => {
    setIsLoading(true);
    
    const sessionMinutes = Math.floor(elapsedTime / 60);
    
    if (timerAvailable) {
      // Try backend timer stop
      try {
        const { timerApi } = await import('@/lib/api');
        // Note: We don't have session ID for manual fallback, so this might fail
        // await timerApi.end(activity.id, sessionId);
        
        // For now, manually increment the reps
        await handleManualStop(sessionMinutes);
      } catch (error) {
        console.error('Backend timer stop failed, using manual increment');
        await handleManualStop(sessionMinutes);
      }
    } else {
      // Manual timer stop
      await handleManualStop(sessionMinutes);
    }
    
    setIsRunning(false);
    setStartTime(null);
    setElapsedTime(0);
    setIsLoading(false);
  };

  const handleManualStop = async (minutes: number) => {
    try {
      // For Focus Hour, increment reps by minutes
      if (activity.name === 'Focus Hour' && minutes > 0) {
        const updatedActivity = await activityApi.increment(activity.id, minutes);
        onUpdate(updatedActivity);
        toast({
          title: "Session Completed",
          description: `Added ${minutes} minutes to ${activity.name}!`,
        });
      } else {
        toast({
          title: "Session Completed",
          description: `${activity.name} session finished! Duration: ${formatTime(elapsedTime)}`,
        });
      }
    } catch (error) {
      toast({
        title: "Session Completed",
        description: `Timer stopped. Please manually update your progress if needed.`,
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // isRunning is already defined as state above

  return (
    <Card className={`transition-all duration-200 ${isRunning ? 'ring-2 ring-blue-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Timer className="h-5 w-5" />
            {activity.name} Timer
          </CardTitle>
          {isRunning && <Badge variant="secondary" className="bg-blue-100 text-blue-800">Running</Badge>}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-4xl font-mono font-bold text-primary">
            {formatTime(elapsedTime)}
          </div>
          <div className="text-sm text-muted-foreground">
            {isRunning ? 'Session in progress' : 'Ready to start'}
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex gap-2">
          {!isRunning ? (
            <Button
              onClick={handleStartTimer}
              disabled={isLoading}
              className="flex-1"
              size="lg"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Timer
            </Button>
          ) : (
            <Button
              onClick={handleStopTimer}
              disabled={isLoading}
              variant="destructive"
              className="flex-1"
              size="lg"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop Timer
            </Button>
          )}
        </div>

        {/* Session Info */}
        {isRunning && startTime && (
          <div className="text-xs text-muted-foreground text-center">
            Session started: {startTime.toLocaleTimeString()}
          </div>
        )}

        {/* Timer Status Info */}
        {!timerAvailable && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted p-2 rounded">
            <AlertCircle className="h-3 w-3" />
            <span>Using manual timer (backend timer not available)</span>
          </div>
        )}

        {/* Note for Focus Hour */}
        {activity.name === 'Focus Hour' && (
          <div className="text-xs text-muted-foreground text-center p-2 bg-muted rounded">
            💡 Each minute adds 1 rep to your count
          </div>
        )}
      </CardContent>
    </Card>
  );
}