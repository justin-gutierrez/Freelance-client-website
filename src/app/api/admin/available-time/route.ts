import { NextRequest, NextResponse } from 'next/server';

interface AvailableTimeRequest {
  startDate: string;
  startTime: string;
  endTime: string;
  notes: string;
  isRecurring: boolean;
  recurringDays: string[];
}

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

export async function POST(request: NextRequest) {
  try {
    const body: AvailableTimeRequest = await request.json();
    const { startDate, startTime, endTime, notes, isRecurring, recurringDays } = body;

    // Validate required fields
    if (!startDate || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, message: 'Date, start time, and end time are required' },
        { status: 400 }
      );
    }

    // Create available time entry
    const availableTime = {
      id: `available-${Date.now()}`,
      startTime: `${startDate}T${startTime}:00.000Z`,
      endTime: `${startDate}T${endTime}:00.000Z`,
      notes,
      isRecurring,
      recurringDays: isRecurring ? recurringDays : undefined,
    };

    availableTimes.push(availableTime);

    return NextResponse.json({
      success: true,
      data: availableTime,
      message: 'Time made available successfully',
    });

  } catch (error) {
    console.error('Error making time available:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to make time available' },
      { status: 500 }
    );
  }
} 