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
    // Calculate date range for next 14 days
    const startDate = new Date();
    startDate.setHours(9, 0, 0, 0); // Start at 9 AM today
    
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14); // 14 days from now
    endDate.setHours(17, 0, 0, 0); // End at 5 PM on the last day

    // Generate 1-hour slots for the date range
    const availableSlots = [];
    let currentTime = new Date(startDate);

    while (currentTime < endDate) {
      // Skip weekends
      if (currentTime.getDay() === 0 || currentTime.getDay() === 6) {
        currentTime.setDate(currentTime.getDate() + 1);
        currentTime.setHours(9, 0, 0, 0);
        continue;
      }

      // Set business hours
      currentTime.setHours(9, 0, 0, 0);
      
      const dayEnd = new Date(currentTime);
      dayEnd.setHours(17, 0, 0, 0);

      // Check if this time slot is available (not blocked)
      const slotStart = new Date(currentTime);
      const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000); // 1 hour slots

      // Check if this slot overlaps with any available times
      let isAvailable = false;
      for (const availableTime of availableTimes) {
        const availableStart = new Date(availableTime.startTime);
        const availableEnd = new Date(availableTime.endTime);

        if (
          (slotStart >= availableStart && slotStart < availableEnd) ||
          (slotEnd > availableStart && slotEnd <= availableEnd) ||
          (slotStart <= availableStart && slotEnd >= availableEnd)
        ) {
          isAvailable = true;
          break;
        }
      }

      if (isAvailable && slotEnd <= dayEnd) {
        availableSlots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
        });
      }

      // Move to next hour
      currentTime.setHours(currentTime.getHours() + 1);
    }

    // Extract just the start times as ISO strings
    const availableDates = availableSlots.map(slot => slot.start);

    return NextResponse.json({
      success: true,
      data: availableDates,
      count: availableDates.length,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
    });

  } catch (error) {
    console.error('Error fetching available dates:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch available dates',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 