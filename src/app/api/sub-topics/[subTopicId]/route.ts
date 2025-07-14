import { NextResponse } from 'next/server';
import { getSubtopicById, updateSubtopic } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: { subTopicId: string } }
) {
    try {
        const subtopic = getSubtopicById(params.subTopicId);
        if (!subtopic) {
            return NextResponse.json({ message: 'Sub-topic not found' }, { status: 404 });
        }
        return NextResponse.json(subtopic);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching sub-topic data' }, { status: 500 });
    }
}

export async function PUT(
  request: Request,
  { params }: { params: { subTopicId: string } }
) {
    try {
        const subtopicData = await request.json();
        const updated = updateSubtopic(params.subTopicId, subtopicData);
        if (!updated) {
            return NextResponse.json({ message: 'Sub-topic not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Sub-topic updated successfully', subTopic: updated });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Error updating sub-topic' }, { status: 500 });
    }
}
