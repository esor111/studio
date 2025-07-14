import DashboardClient from '@/components/dashboard/DashboardClient';
import { getDashboardData as getDashboardDataServer } from '@/lib/mock-data';
import { type DashboardData } from '@/lib/types';

// This function runs on the server.
async function getDashboardData(): Promise<DashboardData> {
  // Since we're in a server component, we can directly call our server-side logic
  // instead of making an HTTP request to our own app. This is more efficient.
  const data = getDashboardDataServer();
  return data;
}

export default async function Home() {
  const initialDashboardData = await getDashboardData();
  return <DashboardClient initialData={initialDashboardData} />;
}
