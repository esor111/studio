
import { NextResponse } from 'next/server';
import { logReps, getDashboardData, getTopicBySubtopicId } from '@/lib/mock-data';

export async function POST(
  request: Request,
  { params }: { params: { subTopicId: string } }
) {
  try {
    const { reps } = await request.json();
    if (typeof reps !== 'number' || (reps !== 1 && reps !== -1)) {
      return NextResponse.json({ message: 'Invalid reps value. Must be 1 or -1.' }, { status: 400 });
    }
    const result = logReps(params.subTopicId, reps);
    if (!result) {
      return NextResponse.json({ message: 'Subtopic not found or rep limit reached.' }, { status: 404 });
    }
    const topic = getTopicBySubtopicId(params.subTopicId);
    
    return NextResponse.json({ 
        message: 'Reps logged successfully', 
        updatedSubtopic: result.updatedSubtopic,
        updatedTopic: topic
    });
  } catch (error: any) {
    console.error('Error logging reps:', error.message);
    return NextResponse.json({ message: 'Error logging reps' }, { status: 500 });
  }
}
