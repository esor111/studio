'use client';

import { useState, useEffect } from 'react';
import { ActivityDashboard as ActivityDashboardType, Activity } from '@/lib/types';
import { dashboardApi, healthApi } from '@/lib/api';
import ActivityStats from './ActivityStats';
import ActivityList from './ActivityList';
import GoalSettingsDialog from './GoalSettingsDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Server, Settings } from 'lucide-react';
import Link from 'next/link';

export default function ActivityDashboard() {
  const [dashboardData, setDashboardData] = useState<ActivityDashboardType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isServerHealthy, setIsServerHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
      await healthApi.check();
      setIsServerHealthy(true);
      fetchDashboardData();
    } catch (error) {
      setIsServerHealthy(false);
      setError('Backend server is not responding. Please check if https://dev.kaha.com.np/exp-backend is accessible');
      setIsLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await dashboardApi.getActivities();
      setDashboardData(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    checkServerHealth();
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !isServerHealthy) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold font-headline">Activity Tracker</h1>
          <p className="text-muted-foreground mt-1">Track your daily activities and build better habits.</p>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button onClick={handleRetry} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>

        <div className="bg-muted/50 p-6 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Server className="h-5 w-5" />
            Backend Setup Instructions
          </h3>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>1. Backend API is deployed at: <code className="bg-muted px-1 rounded">https://dev.kaha.com.np/exp-backend/api</code></p>
            <p>2. Health check endpoint: <code className="bg-muted px-1 rounded">https://dev.kaha.com.np/exp-backend/health</code></p>
            <p>3. API documentation: <code className="bg-muted px-1 rounded">https://dev.kaha.com.np/exp-backend/api-docs</code></p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold font-headline">Activity Tracker</h1>
          <p className="text-muted-foreground mt-1">Track your daily activities and build better habits.</p>
        </div>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No dashboard data available. Please check your backend configuration.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold font-headline">Activity Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's your progress overview for today.
          </p>
        </div>
        <Link href="/activities/goals">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Manage Goals
          </Button>
        </Link>
      </div>
      
      {/* Stats Cards */}
      <ActivityStats stats={dashboardData.stats} />

      {/* Activities List */}
      <ActivityList initialActivities={dashboardData.activities} />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-4 w-1/3 mt-2" />
      </div>
      
      {/* Stats skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>

      {/* Activities skeleton */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-1/5" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        {/* Timer card skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-48 rounded-lg" />
        </div>
        
        {/* Activity cards skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}