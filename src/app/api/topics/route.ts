import { NextResponse } from 'next/server';
import { createTopic, getCategories } from '@/lib/mock-data';
import { type Topic } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const topicData = await request.json();
    const newTopic = createTopic(topicData);
    return NextResponse.json(newTopic, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error creating topic' }, { status: 500 });
  }
}

export async function GET(request: Request) {
    try {
      const categories = getCategories();
      return NextResponse.json(categories);
    } catch (error) {
      return NextResponse.json({ message: 'Error fetching categories' }, { status: 500 });
    }
  }