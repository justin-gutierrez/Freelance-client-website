import { NextRequest, NextResponse } from 'next/server';
import { createZoomMeeting } from '@/lib/zoom';
import { createCalendarEvent, sendConfirmationEmails } from '@/lib/google-calendar';
import { addBooking } from '@/app/api/admin/bookings/route';

interface CreateBookingRequest {
  guestName: string;
  guestEmail: string;
  date: string;
  time: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: CreateBookingRequest = await request.json();
    const { guestName, guestEmail, date, time, message } = body;

    // Validate required fields
    if (!guestName || !guestEmail || !date || !time) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Guest name, email, date, and time are required',
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
          message: 'Please provide a valid email address',
        },
        { status: 400 }
      );
    }

    // Combine date and time to create start time
    const startTime = new Date(`${date}T${time}`);
    const now = new Date();
    
    // Validate that the booking is in the future
    if (startTime <= now) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid time',
          message: 'Booking time must be in the future',
        },
        { status: 400 }
      );
    }

    // Calculate end time (1 hour after start)
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);

    // Create Zoom meeting
    const zoomMeeting = await createZoomMeeting(guestName, {
      topic: `Photography Consultation - ${guestName}`,
      startTime: startTime.toISOString(),
      duration: 60, // 1 hour
    });

    // Create booking record
    const bookingId = `booking-${Date.now()}`;
    const booking = {
      id: bookingId,
      guestName,
      guestEmail,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      message: message || '',
      zoomMeetingId: zoomMeeting.id.toString(),
    };

    // Add booking to storage
    addBooking(booking);

    // Create Google Calendar event
    const calendarEvent = await createCalendarEvent({
      summary: `Photography Consultation - ${guestName}`,
      description: `Photography consultation with ${guestName}${message ? `\n\nClient Message: ${message}` : ''}`,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      attendees: [
        { email: guestEmail, name: guestName },
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
          guestName,
          guestEmail,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        },
      },
      message: 'Booking created successfully! Google Calendar event created and confirmation emails sent to both client and photographer.',
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('ZOOM_API_KEY') || error.message.includes('ZOOM_API_SECRET')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Zoom configuration error',
            message: 'Zoom API credentials are not properly configured',
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Booking creation failed',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

 