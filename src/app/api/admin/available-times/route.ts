import { NextRequest, NextResponse } from 'next/server';

// In a real app, you'd store this in a database
// For now, we'll use a simple in-memory store (will reset on server restart)
let availableTimes: Array<{
  id: string;
  startTime: string;
  endTime: string;
  notes: string;
  isRecurring: boolean;
  recurringDays?: string[];
}> = [];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      availableTimes,
    });
  } catch (error) {
    console.error('Error fetching available times:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch available times' },
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
        { success: false, message: 'Available time ID is required' },
        { status: 400 }
      );
    }

    availableTimes = availableTimes.filter(availableTime => availableTime.id !== id);

    return NextResponse.json({
      success: true,
      message: 'Available time removed successfully',
    });
  } catch (error) {
    console.error('Error removing available time:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to remove available time' },
      { status: 500 }
    );
  }
} 