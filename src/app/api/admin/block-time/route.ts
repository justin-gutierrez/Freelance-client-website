import { NextRequest, NextResponse } from 'next/server';

interface BlockTimeRequest {
  startDate: string;
  startTime: string;
  endTime: string;
  reason: string;
  isRecurring: boolean;
  recurringDays: string[];
}

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

export async function POST(request: NextRequest) {
  try {
    const body: BlockTimeRequest = await request.json();
    const { startDate, startTime, endTime, reason, isRecurring, recurringDays } = body;

    // Validate required fields
    if (!startDate || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, message: 'Date, start time, and end time are required' },
        { status: 400 }
      );
    }

    // Create blocked time entry
    const blockedTime = {
      id: `blocked-${Date.now()}`,
      startTime: `${startDate}T${startTime}:00.000Z`,
      endTime: `${startDate}T${endTime}:00.000Z`,
      reason,
      isRecurring,
      recurringDays: isRecurring ? recurringDays : undefined,
    };

    blockedTimes.push(blockedTime);

    return NextResponse.json({
      success: true,
      data: blockedTime,
      message: 'Time blocked successfully',
    });

  } catch (error) {
    console.error('Error blocking time:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to block time' },
      { status: 500 }
    );
  }
} 