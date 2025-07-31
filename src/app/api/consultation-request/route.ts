import { NextRequest, NextResponse } from 'next/server';
import { addConsultationRequest } from '@/lib/consultation-requests';

interface ConsultationRequest {
  name: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  bookingType: 'request';
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: ConsultationRequest = await request.json();
    const { name, email, preferredDate, preferredTime, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Name, email, and message are required',
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

    // Create consultation request record
    const requestId = `request-${Date.now()}`;
    const consultationRequest = {
      id: requestId,
      name,
      email,
      preferredDate: preferredDate || '',
      preferredTime: preferredTime || '',
      message,
      createdAt: new Date().toISOString(),
      status: 'pending' as const,
    };

    // Store the request
    addConsultationRequest(consultationRequest);

    // Send notification email to admin (placeholder - implement actual email sending)
    await sendNotificationEmail(consultationRequest);

    return NextResponse.json({
      success: true,
      data: {
        requestId: requestId,
        consultationRequest: {
          id: requestId,
          name,
          email,
          preferredDate,
          preferredTime,
          message,
        },
      },
      message: 'Consultation request submitted successfully! I\'ll get back to you within 24 hours.',
    });

  } catch (error) {
    console.error('Error submitting consultation request:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Request failed',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

// Helper function to send notification email to admin
async function sendNotificationEmail(request: any) {
  try {
    // In a real implementation, you would use a service like SendGrid, Mailgun, or AWS SES
    // For now, we'll just log the email details
    console.log('=== CONSULTATION REQUEST NOTIFICATION ===');
    console.log('To: admin@photographer.com');
    console.log('Subject: New Consultation Request');
    console.log('Body:', {
      requestId: request.id,
      name: request.name,
      email: request.email,
      preferredDate: request.preferredDate,
      preferredTime: request.preferredTime,
      message: request.message,
      createdAt: request.createdAt,
    });
    console.log('=========================================');
    
    // TODO: Implement actual email sending
    // Example with a hypothetical email service:
    // await emailService.send({
    //   to: process.env.ADMIN_EMAIL,
    //   subject: 'New Consultation Request',
    //   html: generateEmailTemplate(request)
    // });
    
  } catch (error) {
    console.error('Error sending notification email:', error);
    // Don't fail the request if email fails
  }
} 