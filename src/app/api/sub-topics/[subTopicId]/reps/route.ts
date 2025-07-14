import { NextResponse } from 'next/server';
import { logReps, getDashboardData } from '@/lib/mock-data';

export async function POST(
  request: Request,
  { params }: { params: { subTopicId: string } }
) {
  try {
    const { reps } = await request.json();
    if (typeof reps !== 'number') {
      return NextResponse.json({ message: 'Invalid reps value' }, { status: 400 });
    }
    const result = logReps(params.subTopicId, reps);
    if (!result) {
      return NextResponse.json({ message: 'Subtopic not found' }, { status: 404 });
    }
    const dashboardData = getDashboardData();
    return NextResponse.json({ 
        message: 'Reps logged successfully', 
        ...result,
        dashboard: dashboardData
    });
  } catch (error: any) {
    console.error('Error logging reps:', error.message);
    return NextResponse.json({ message: 'Error logging reps' }, { status: 500 });
  }
}
