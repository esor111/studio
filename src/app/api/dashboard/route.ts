import { NextResponse } from 'next/server';
import { getDashboardData } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = getDashboardData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching dashboard data' }, { status: 500 });
  }
}
