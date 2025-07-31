import { NextRequest, NextResponse } from 'next/server';
import { getConsultationRequests } from '@/lib/consultation-requests';

export async function GET(request: NextRequest) {
  try {
    const requests = getConsultationRequests();

    return NextResponse.json({
      success: true,
      requests: requests,
    });

  } catch (error) {
    console.error('Error fetching consultation requests:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch consultation requests' },
      { status: 500 }
    );
  }
} 