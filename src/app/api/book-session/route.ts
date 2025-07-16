import { NextRequest, NextResponse } from 'next/server';
import { createZoomMeeting } from '@/lib/zoom';
import { createCalendarEvent, sendConfirmationEmails } from '@/lib/google-calendar';
import { addBooking } from '@/app/api/admin/bookings/route';

interface BookingRequest {
  name: string;
  email: string;
  message: string;
  selectedTime: string;
  bookingType: 'scheduled';
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: BookingRequest = await request.json();
    const { name, email, message, selectedTime, bookingType } = body;

    // Validate required fields
    if (!name || !email || !selectedTime) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Name, email, and selected time are required',
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
          message: 'This endpoint is for scheduled consultations only',
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

    // Validate selected time is in the future
    const selectedDateTime = new Date(selectedTime);
    const now = new Date();
    if (selectedDateTime <= now) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid time',
          message: 'Selected time must be in the future',
        },
        { status: 400 }
      );
    }

    // Validate that the selected time is on a Wednesday
    if (selectedDateTime.getDay() !== 3) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid day',
          message: 'Consultations are only available on Wednesdays',
        },
        { status: 400 }
      );
    }

    // Validate that the time is between 9 AM and 5 PM
    const hour = selectedDateTime.getHours();
    if (hour < 9 || hour >= 17) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid time',
          message: 'Consultations are only available between 9 AM and 5 PM',
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
        guest: {
          name,
          email,
        },
      },
      message: 'Booking confirmed successfully! Google Calendar event created and confirmation emails sent. Check your email for meeting details.',
    });

  } catch (error) {
    console.error('Error booking session:', error);
    
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
      
      if (error.message.includes('GOOGLE_CALENDAR_ID') || error.message.includes('GOOGLE_CLIENT_EMAIL')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Google Calendar configuration error',
            message: 'Google Calendar credentials are not properly configured',
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Booking failed',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

 