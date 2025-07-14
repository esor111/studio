import { NextResponse } from 'next/server';
import { getTopicById } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  try {
    const topic = getTopicById(params.topicId);
    if (!topic) {
      return NextResponse.json({ message: 'Topic not found' }, { status: 404 });
    }
    return NextResponse.json(topic);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching topic data' }, { status: 500 });
  }
}
