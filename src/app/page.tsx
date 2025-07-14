
'use client'; // This page now fetches data on the client side

import { useState, useEffect } from 'react';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { type DashboardData } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

async function getDashboardData(): Promise<DashboardData> {
  // Now fetching from our API route, which will be proxied to the mock server
  const res = await fetch('/api/dashboard');
  if (!res.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  return res.json();
}

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardData()
      .then(data => {
        setDashboardData(data);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <div className="text-destructive">Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return <DashboardClient initialData={dashboardData} />;
}


function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-4 w-1/3 mt-2" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-1/5" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
