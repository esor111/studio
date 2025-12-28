'use client';

import { useState, useEffect } from 'react';
import { Activity, ProgressData } from '@/lib/types';
import { activityApi } from '@/lib/api';
import ActivityCard from './ActivityCard';
import TimerCard from './TimerCard';
import AddActivityDialog from './AddActivityDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActivityListProps {
  initialActivities?: Activity[];
}

export default function ActivityList({ initialActivities = [] }: ActivityListProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [progressData, setProgressData] = useState<Record<string, ProgressData>>({});
  const [isLoading, setIsLoading] = useState(!initialActivities.length);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialActivities.length) {
      fetchActivities();
    } else {
      fetchProgressData(initialActivities);
    }
  }, []);

  const fetchActivities = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedActivities = await activityApi.getAll();
      setActivities(fetchedActivities);
      await fetchProgressData(fetchedActivities);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch activities');
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

  const handleActivityUpdate = (updatedActivity: Activity) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === updatedActivity.id ? updatedActivity : activity
      )
    );
    
    // Refresh progress data for the updated activity
    activityApi.getProgress(updatedActivity.id)
      .then(progress => {
        setProgressData(prev => ({
          ...prev,
          [updatedActivity.id]: progress
        }));
      })
      .catch(console.error);
  };

  const handleActivityAdded = (newActivity: Activity) => {
    setActivities(prev => [...prev, newActivity]);
    // Initialize progress data for new activity (will be empty initially)
    setProgressData(prev => ({
      ...prev,
      [newActivity.id]: {
        daily_progress: { current: 0, target: newActivity.goals.daily, percentage: 0, remaining: newActivity.goals.daily },
        weekly_progress: { current: 0, target: newActivity.goals.weekly, percentage: 0, remaining: newActivity.goals.weekly },
        monthly_progress: { current: 0, target: newActivity.goals.monthly, percentage: 0, remaining: newActivity.goals.monthly },
        yearly_progress: { current: 0, target: newActivity.goals.yearly, percentage: 0, remaining: newActivity.goals.yearly },
        time_remaining_today: 24 * 60 // 24 hours in minutes
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Activities</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Activities</h2>
          <Button onClick={fetchActivities} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}. Make sure your backend server is accessible at https://dev.kaha.com.np/exp-backend/api
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Activities</h2>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No activities found. Make sure your backend is properly set up with sample data.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Separate Focus Hour for timer display
  const focusHourActivity = activities.find(activity => activity.name === 'Focus Hour');
  const otherActivities = activities.filter(activity => activity.name !== 'Focus Hour');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Activities</h2>
        <div className="flex items-center gap-2">
          <AddActivityDialog onActivityAdded={handleActivityAdded} />
          <Button onClick={fetchActivities} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Focus Hour Timer (if exists) */}
      {focusHourActivity && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-muted-foreground">Timer Session</h3>
          <TimerCard 
            activity={focusHourActivity} 
            onUpdate={handleActivityUpdate}
          />
        </div>
      )}

      {/* Other Activities */}
      {otherActivities.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-muted-foreground">
            Quick Actions
          </h3>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {otherActivities.map(activity => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                progress={progressData[activity.id]}
                onUpdate={handleActivityUpdate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}