import { NextRequest, NextResponse } from 'next/server';

// In a real app, you'd store this in a database
// For now, we'll use a simple in-memory store (will reset on server restart)
let bookings: Array<{
  id: string;
  guestName: string;
  guestEmail: string;
  startTime: string;
  endTime: string;
  message: string;
  zoomMeetingId: string;
}> = [];

export async function GET(request: NextRequest) {
  try {
    // Filter for future bookings only
    const now = new Date();
    const futureBookings = bookings.filter(booking => 
      new Date(booking.startTime) > now
    );

    return NextResponse.json({
      success: true,
      bookings: futureBookings,
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// Helper function to add a new booking (called from book-session API)
export function addBooking(booking: {
  id: string;
  guestName: string;
  guestEmail: string;
  startTime: string;
  endTime: string;
  message: string;
  zoomMeetingId: string;
}) {
  bookings.push(booking);
} 