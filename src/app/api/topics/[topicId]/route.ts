import { NextResponse } from 'next/server';
import { getTopicById, updateTopic } from '@/lib/mock-data';
import { type Topic } from '@/lib/types';

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

export async function PUT(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  try {
    const topicData: Partial<Topic> = await request.json();
    const updated = updateTopic(params.topicId, topicData);
    if (!updated) {
      return NextResponse.json({ message: 'Topic not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error updating topic' }, { status: 500 });
  }
}
