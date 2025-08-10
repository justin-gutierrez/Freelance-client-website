import { NextRequest, NextResponse } from 'next/server';
import { addBooking } from '@/lib/bookings';
import { createZoomMeeting } from '@/lib/zoom';
import { createCalendarEvent, sendConfirmationEmails } from '@/lib/google-calendar';

interface BookingRequest {
  name: string;
  email: string;
  message?: string;
  selectedTime: string;
  bookingType: 'scheduled';
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: BookingRequest = await request.json();
    const { name, email, message, selectedTime, bookingType } = body;

    // Validate required fields
    if (!name || !email || !selectedTime || !bookingType) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Name, email, selected time, and booking type are required',
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
          message: 'Please provide a valid email address',
        },
        { status: 400 }
      );
    }

    // Validate booking type
    if (bookingType !== 'scheduled') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid booking type',
          message: 'Only scheduled consultations are supported',
        },
        { status: 400 }
      );
    }

    // Parse and validate the selected time
    const selectedDateTime = new Date(selectedTime);
    
    if (isNaN(selectedDateTime.getTime())) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid time format',
          message: 'Please provide a valid time format',
        },
        { status: 400 }
      );
    }

    // Ensure the selected time is in the future
    const now = new Date();
    if (selectedDateTime <= now) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid time',
          message: 'Booking time must be in the future',
        },
        { status: 400 }
      );
    }

    // Validate that the selected time is on a Wednesday
    const dayOfWeek = selectedDateTime.getUTCDay();
    if (dayOfWeek !== 3) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid day',
          message: 'Consultations are only available on Wednesdays',
          received: {
            selectedTime: selectedTime,
            dayOfWeek: dayOfWeek,
            dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]
          }
        },
        { status: 400 }
      );
    }

    // Calculate end time (1 hour after start)
    const endTime = new Date(selectedDateTime);
    endTime.setHours(endTime.getHours() + 1);

    // Create Zoom meeting
    const zoomMeeting = await createZoomMeeting(name, {
      topic: `Photography Consultation - ${name}`,
      startTime: selectedDateTime.toISOString(),
      duration: 60, // 1 hour
    });

    // Create booking record
    const bookingId = `booking-${Date.now()}`;
    const booking = {
      id: bookingId,
      guestName: name,
      guestEmail: email,
      startTime: selectedDateTime.toISOString(),
      endTime: endTime.toISOString(),
      message: message || '',
      zoomMeetingId: zoomMeeting.id.toString(),
    };

    // Add booking to storage
    addBooking(booking);

    // Create Google Calendar event
    const calendarEvent = await createCalendarEvent({
      summary: `Photography Consultation - ${name}`,
      description: `Photography consultation with ${name}${message ? `\n\nClient Message: ${message}` : ''}`,
      startTime: selectedDateTime.toISOString(),
      endTime: endTime.toISOString(),
      attendees: [
        { email: email, name: name },
        { email: process.env.PHOTOGRAPHER_EMAIL || 'photographer@example.com', name: 'Photographer' }
      ],
      zoomJoinUrl: zoomMeeting.join_url,
      zoomPassword: zoomMeeting.password,
    });

    // Send confirmation emails to both client and photographer
    await sendConfirmationEmails(booking, zoomMeeting, calendarEvent);

    return NextResponse.json({
      success: true,
      data: {
        bookingId: bookingId,
        zoomMeeting: {
          id: zoomMeeting.id,
          joinUrl: zoomMeeting.join_url,
          startUrl: zoomMeeting.start_url,
          password: zoomMeeting.password,
        },
        booking: {
          id: bookingId,
          guestName: name,
          guestEmail: email,
          startTime: selectedDateTime.toISOString(),
          endTime: endTime.toISOString(),
        },
      },
      message: 'Booking created successfully! Google Calendar event created and confirmation emails sent to both client and photographer.',
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Booking creation failed',
        message: 'An error occurred while creating your booking. Please try again.',
      },
      { status: 500 }
    );
  }
}
