import { google } from 'googleapis';
import { createZoomMeeting as createZoomMeetingOAuth } from '@/lib/zoom';

interface CalendarEvent {
  summary: string;
  description: string;
  startTime: string;
  endTime: string;
  attendees: Array<{ email: string; name?: string }>;
  zoomJoinUrl?: string;
  zoomPassword?: string;
}

function createJWTClient() {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error('Google Calendar credentials are not properly configured');
  }
  const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
  const client = new google.auth.JWT();
  client.fromJSON({
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: privateKey,
  });
  client.scopes = ['https://www.googleapis.com/auth/calendar'];
  return client;
}

/**
 * Create a Google Calendar event and send invitations
 * @param event - Event details including attendees
 * @returns Created event details
 */
export async function createCalendarEvent(event: CalendarEvent) {
  try {
    const auth = createJWTClient();
    const calendar = google.calendar({ version: 'v3', auth });

    // Ensure we're using the photographer's calendar
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    let zoomJoinUrl = event.zoomJoinUrl;
    if (!zoomJoinUrl) {
      // Use the OAuth-based createZoomMeeting
      const zoomMeeting = await createZoomMeetingOAuth(event.summary, {
        startTime: event.startTime,
        duration: Math.round((new Date(event.endTime).getTime() - new Date(event.startTime).getTime()) / (1000 * 60)),
      });
      zoomJoinUrl = zoomMeeting.join_url;
    }

    const eventResource = {
      summary: event.summary,
      description: event.description,
      start: {
        dateTime: event.startTime,
        timeZone: 'America/New_York', // Adjust timezone as needed
      },
      end: {
        dateTime: event.endTime,
        timeZone: 'America/New_York', // Adjust timezone as needed
      },
      attendees: event.attendees,
      conferenceData: zoomJoinUrl ? {
        createRequest: {
          requestId: `zoom-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      } : undefined,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 15 }, // 15 minutes before
        ],
      },
      sendUpdates: 'all', // Send invitations to all attendees
    };

    const response = await calendar.events.insert({
      calendarId,
      requestBody: eventResource,
      conferenceDataVersion: zoomJoinUrl ? 1 : 0,
    });

    return {
      id: response.data.id,
      htmlLink: response.data.htmlLink,
      hangoutLink: response.data.hangoutLink,
      attendees: response.data.attendees,
    };

  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    throw error;
  }
}

/**
 * Send confirmation emails to both client and photographer
 * @param booking - Booking details
 * @param zoomMeeting - Zoom meeting details
 * @param calendarEvent - Google Calendar event details
 */
export async function sendConfirmationEmails(
  booking: any, 
  zoomMeeting: any, 
  calendarEvent: any
) {
  try {
    // In a real implementation, you would use a service like SendGrid, Mailgun, or AWS SES
    // For now, we'll log the email details
    
    // Email to client
    console.log('=== CLIENT CONFIRMATION EMAIL ===');
    console.log('To:', booking.guestEmail);
    console.log('Subject: Photography Consultation Confirmed');
    console.log('Body:', {
      guestName: booking.guestName,
      date: new Date(booking.startTime).toLocaleDateString(),
      time: new Date(booking.startTime).toLocaleTimeString(),
      zoomJoinUrl: zoomMeeting.join_url,
      zoomPassword: zoomMeeting.password,
      calendarLink: calendarEvent.htmlLink,
      message: booking.message,
    });
    console.log('================================');

    // Email to photographer
    console.log('=== PHOTOGRAPHER CONFIRMATION EMAIL ===');
    console.log('To: photographer@example.com'); // Replace with actual photographer email
    console.log('Subject: New Photography Consultation Booking');
    console.log('Body:', {
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      date: new Date(booking.startTime).toLocaleDateString(),
      time: new Date(booking.startTime).toLocaleTimeString(),
      zoomStartUrl: zoomMeeting.start_url,
      zoomJoinUrl: zoomMeeting.join_url,
      zoomPassword: zoomMeeting.password,
      calendarLink: calendarEvent.htmlLink,
      message: booking.message,
    });
    console.log('=====================================');
    
    // TODO: Implement actual email sending
    // Example with a hypothetical email service:
    // await emailService.send({
    //   to: booking.guestEmail,
    //   subject: 'Photography Consultation Confirmed',
    //   html: generateClientEmailTemplate(booking, zoomMeeting, calendarEvent)
    // });
    // 
    // await emailService.send({
    //   to: process.env.PHOTOGRAPHER_EMAIL,
    //   subject: 'New Photography Consultation Booking',
    //   html: generatePhotographerEmailTemplate(booking, zoomMeeting, calendarEvent)
    // });
    
  } catch (error) {
    console.error('Error sending confirmation emails:', error);
    // Don't fail the booking creation if email fails
  }
}

/**
 * Generate email templates for confirmation emails
 */
export function generateClientEmailTemplate(booking: any, zoomMeeting: any, calendarEvent: any) {
  const date = new Date(booking.startTime).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const time = new Date(booking.startTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Photography Consultation Confirmed</h2>
      <p>Hi ${booking.guestName},</p>
      <p>Your photography consultation has been confirmed!</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Consultation Details</h3>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Duration:</strong> 1 hour</p>
      </div>
      
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Join Your Meeting</h3>
        <p><a href="${zoomMeeting.join_url}" style="background: #2196f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Join Zoom Meeting</a></p>
        <p><strong>Meeting Password:</strong> ${zoomMeeting.password}</p>
      </div>
      
      <div style="background: #f1f8e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Add to Calendar</h3>
        <p><a href="${calendarEvent.htmlLink}" style="color: #4caf50;">Add to Google Calendar</a></p>
      </div>
      
      <p>If you have any questions or need to reschedule, please don't hesitate to reach out.</p>
      <p>Looking forward to our consultation!</p>
    </div>
  `;
}

export function generatePhotographerEmailTemplate(booking: any, zoomMeeting: any, calendarEvent: any) {
  const date = new Date(booking.startTime).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const time = new Date(booking.startTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Photography Consultation Booking</h2>
      <p>You have a new consultation booking!</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Client Details</h3>
        <p><strong>Name:</strong> ${booking.guestName}</p>
        <p><strong>Email:</strong> ${booking.guestEmail}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Duration:</strong> 1 hour</p>
      </div>
      
      <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Client Message</h3>
        <p>${booking.message || 'No message provided'}</p>
      </div>
      
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Meeting Links</h3>
        <p><a href="${zoomMeeting.start_url}" style="background: #ff9800; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Start Meeting (Host)</a></p>
        <p><a href="${zoomMeeting.join_url}" style="background: #2196f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Join Meeting</a></p>
        <p><strong>Meeting Password:</strong> ${zoomMeeting.password}</p>
      </div>
      
      <div style="background: #f1f8e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Calendar Event</h3>
        <p><a href="${calendarEvent.htmlLink}" style="color: #4caf50;">View in Google Calendar</a></p>
      </div>
    </div>
  `;
} 