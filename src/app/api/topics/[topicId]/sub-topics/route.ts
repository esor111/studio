import { NextResponse } from 'next/server';
import { addSubtopicToTopic } from '@/lib/mock-data';

export async function POST(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  try {
    const subtopicData = await request.json();
    if (!subtopicData.title) {
        return NextResponse.json({ message: 'Title is required for a sub-topic.' }, { status: 400 });
    }
    const newSubtopic = addSubtopicToTopic(params.topicId, subtopicData);

    if (!newSubtopic) {
        return NextResponse.json({ message: 'Topic not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Sub-topic created successfully', subTopic: newSubtopic }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error creating sub-topic' }, { status: 500 });
  }
}
