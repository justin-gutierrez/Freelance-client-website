import { NextRequest, NextResponse } from 'next/server';
import { getBookingsForDate, getAvailableTimeSlots } from '@/lib/bookings';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    
    if (!dateParam) {
      return NextResponse.json(
        { success: false, message: 'Date parameter is required' },
        { status: 400 }
      );
    }

    const requestedDate = new Date(dateParam);
    
    // Validate date format
    if (isNaN(requestedDate.getTime())) {
      return NextResponse.json(
        { success: false, message: 'Invalid date format' },
        { status: 400 }
      );
    }
    
    // Debug logging for date validation
    console.log('Available times API - Date validation:', {
      dateParam,
      requestedDate: requestedDate.toISOString(),
      dayOfWeek: requestedDate.getUTCDay(),
      dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][requestedDate.getUTCDay()],
      localDate: requestedDate.toLocaleDateString(),
      utcDate: requestedDate.toUTCString()
    });
    
    // Ensure the requested date is a Wednesday
    if (requestedDate.getUTCDay() !== 3) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Only Wednesdays are available for consultations',
          received: {
            date: requestedDate.toISOString(),
            day: requestedDate.getUTCDay(),
            dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][requestedDate.getUTCDay()]
          }
        },
        { status: 400 }
      );
    }

    // Get bookings for the requested date
    const dateBookings = getBookingsForDate(requestedDate);
    
    // Get available time slots for the requested date
    const availableSlots = getAvailableTimeSlots(requestedDate);

    // Generate all possible time slots for the requested date (9 AM - 5 PM)
    const allTimeSlots = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      // Create time slot in local timezone to avoid day shifting
      const slotStart = new Date(requestedDate.getFullYear(), requestedDate.getMonth(), requestedDate.getDate(), hour, 0, 0, 0);
      
      const slotEnd = new Date(slotStart);
      slotEnd.setHours(slotStart.getHours() + 1);
      
      // Verify the slot is still on the same day (Wednesday)
      if (slotStart.getUTCDay() !== 3) {
        console.warn(`Time slot shifted to wrong day: ${slotStart.toISOString()} (day ${slotStart.getUTCDay()})`);
        continue; // Skip this slot if it shifted to wrong day
      }
      
      allTimeSlots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        time: slotStart.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
        hour: hour
      });
    }

    return NextResponse.json({
      success: true,
      date: requestedDate.toISOString(),
      availableSlots,
      bookedSlots: dateBookings.map(booking => ({
        startTime: booking.startTime,
        endTime: booking.endTime,
        guestName: booking.guestName,
        time: new Date(booking.startTime).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      })),
      totalSlots: allTimeSlots.length,
      availableCount: availableSlots.length,
      bookedCount: dateBookings.length
    });

  } catch (error) {
    console.error('Error fetching available times:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch available times' },
      { status: 500 }
    );
  }
}
