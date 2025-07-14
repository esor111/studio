import { NextResponse } from 'next/server';
import { setGlobalGoal } from '@/lib/mock-data';

export async function PUT(request: Request) {
  try {
    const { goal } = await request.json();
    if (typeof goal !== 'number' || goal < 0) {
      return NextResponse.json({ message: 'Invalid goal amount' }, { status: 400 });
    }
    setGlobalGoal(goal);
    return NextResponse.json({ message: 'Global goal updated successfully', goal });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating global goal' }, { status: 500 });
  }
}
