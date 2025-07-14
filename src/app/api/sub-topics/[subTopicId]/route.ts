// This route is now handled by the mock server in server.js
// You can remove this file if you wish, but it's kept for reference.
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    return NextResponse.json({ message: 'This endpoint is handled by the mock server.' }, { status: 404 });
}
export async function PUT(request: Request) {
    return NextResponse.json({ message: 'This endpoint is handled by the mock server.' }, { status: 404 });
}
