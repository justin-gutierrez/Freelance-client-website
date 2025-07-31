import { NextRequest, NextResponse } from 'next/server';
import { getFutureBookings } from '@/lib/bookings';

export async function GET(request: NextRequest) {
  try {
    const futureBookings = getFutureBookings();

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