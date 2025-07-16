import { google } from 'googleapis';
import { createZoomMeeting as createZoomMeetingOAuth } from '@/lib/zoom';

// Initialize Google Calendar API client
export const getGoogleCalendarClient = () => {
  // Use service account authentication with your private key
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  return google.calendar({ version: 'v3', auth });
};

/**
 * Get available time slots between start and end dates
 * @param startDate - Start date in ISO string format
 * @param endDate - End date in ISO string format
 * @returns Array of available time slots
 */
export async function getAvailableTimeSlots(startDate: string, endDate: string) {
  try {
    const calendar = getGoogleCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId) {
      throw new Error('GOOGLE_CALENDAR_ID environment variable is not set');
    }

    // Get busy times from the calendar
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startDate,
        timeMax: endDate,
        items: [{ id: calendarId }],
      },
    });

    const busyTimes = response.data.calendars?.[calendarId]?.busy || [];
    
    // Convert busy times to available time slots
    const availableSlots = [];
    let currentTime = new Date(startDate);
    const endTime = new Date(endDate);

    // Define business hours (9 AM to 5 PM)
    const businessStartHour = 9;
    const businessEndHour = 17;

    while (currentTime < endTime) {
      // Skip weekends
      if (currentTime.getDay() === 0 || currentTime.getDay() === 6) {
        currentTime.setDate(currentTime.getDate() + 1);
        currentTime.setHours(businessStartHour, 0, 0, 0);
        continue;
      }

      // Set business hours
      currentTime.setHours(businessStartHour, 0, 0, 0);
      
      const dayEnd = new Date(currentTime);
      dayEnd.setHours(businessEndHour, 0, 0, 0);

      // Check if this time slot conflicts with any busy times
      const slotStart = new Date(currentTime);
      const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000); // 1 hour slots

      let isAvailable = true;
      for (const busy of busyTimes) {
        const busyStart = new Date(busy.start || '');
        const busyEnd = new Date(busy.end || '');

        if (
          (slotStart >= busyStart && slotStart < busyEnd) ||
          (slotEnd > busyStart && slotEnd <= busyEnd) ||
          (slotStart <= busyStart && slotEnd >= busyEnd)
        ) {
          isAvailable = false;
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

    return availableSlots;
  } catch (error) {
    console.error('Error getting available time slots:', error);
    throw error;
  }
}

/**
 * Create a calendar event with Zoom link and invite a guest
 * @param eventData - Event details
 * @returns Created event
 */
export async function createCalendarEvent(eventData: {
  summary: string;
  description: string;
  startTime: string;
  endTime: string;
  guestEmail: string;
  zoomLink?: string;
}) {
  try {
    const calendar = getGoogleCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId) {
      throw new Error('GOOGLE_CALENDAR_ID environment variable is not set');
    }

    // Create Zoom meeting if no link provided
    let zoomLink = eventData.zoomLink;
    if (!zoomLink) {
      // Use the OAuth-based createZoomMeeting
      const zoomMeeting = await createZoomMeetingOAuth(eventData.summary, {
        startTime: eventData.startTime,
        duration: Math.round((new Date(eventData.endTime).getTime() - new Date(eventData.startTime).getTime()) / (1000 * 60)),
      });
      zoomLink = zoomMeeting.join_url;
    }

    // Prepare event description with Zoom link
    const description = `${eventData.description}\n\nJoin Zoom Meeting: ${zoomLink}`;

    const event = {
      summary: eventData.summary,
      description,
      start: {
        dateTime: eventData.startTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: eventData.endTime,
        timeZone: 'UTC',
      },
      attendees: [
        { email: eventData.guestEmail },
      ],
      conferenceData: {
        createRequest: {
          requestId: `zoom-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 10 }, // 10 minutes before
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
      sendUpdates: 'all', // Send invitations to attendees
      conferenceDataVersion: 1,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
} 