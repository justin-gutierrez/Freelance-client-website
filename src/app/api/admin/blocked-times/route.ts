import { NextRequest, NextResponse } from 'next/server';

// In a real app, you'd store this in a database
// For now, we'll use a simple in-memory store (will reset on server restart)
let blockedTimes: Array<{
  id: string;
  startTime: string;
  endTime: string;
  reason: string;
  isRecurring: boolean;
  recurringDays?: string[];
}> = [];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      blockedTimes,
    });
  } catch (error) {
    console.error('Error fetching blocked times:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blocked times' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Blocked time ID is required' },
        { status: 400 }
      );
    }

    blockedTimes = blockedTimes.filter(blockedTime => blockedTime.id !== id);

    return NextResponse.json({
      success: true,
      message: 'Blocked time removed successfully',
    });
  } catch (error) {
    console.error('Error removing blocked time:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to remove blocked time' },
      { status: 500 }
    );
  }
} 