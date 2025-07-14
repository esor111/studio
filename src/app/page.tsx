
import DashboardClient from '@/components/dashboard/DashboardClient';
import { type DashboardData } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

async function getDashboardData(): Promise<DashboardData | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, { cache: 'no-store' });
  if (!res.ok) {
    console.error('Failed to fetch dashboard data:', res.status, await res.text());
    return null;
  }
  return res.json();
}

export default async function Home() {
  const dashboardData = await getDashboardData();

  if (!dashboardData) {
    return (
       <div className="space-y-8">
         <div className="text-destructive">Error: Failed to load dashboard data. Please ensure the mock server is running.</div>
         <DashboardSkeleton />
       </div>
    )
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
