# Google Calendar Integration Setup

This guide explains how to set up Google Calendar integration for automatic event creation and email notifications.

## Overview

The system now automatically:
1. Creates Google Calendar events when bookings are made
2. Sends calendar invitations to both client and photographer
3. Syncs with the photographer's Apple Calendar (via Google Calendar sync)
4. Sends confirmation emails with calendar links

## Setup Steps

### 1. Create Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

4. Create a Service Account:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the details and click "Create"
   - Click on the created service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create New Key"
   - Choose "JSON" format
   - Download the JSON file

### 2. Share Calendar with Service Account

1. Open your Google Calendar
2. Find your calendar in the left sidebar
3. Click the three dots next to your calendar name
4. Select "Settings and sharing"
5. Scroll down to "Share with specific people"
6. Click "Add people"
7. Add the service account email (found in the JSON file as `client_email`)
8. Give it "Make changes to events" permission
9. Click "Send"

### 3. Environment Variables

Add these environment variables to your `.env.local` file:

```env
# Google Calendar Service Account
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----"
GOOGLE_CALENDAR_ID=your-calendar-id@gmail.com

# Photographer Email (for notifications)
PHOTOGRAPHER_EMAIL=photographer@example.com
```

**Important Notes:**
- `GOOM_PRIVATE_KEY` should be the entire private key from the JSON file, including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` parts
- `GOOGLE_CALENDAR_ID` is your Google Calendar email address
- `PHOTOGRAPHER_EMAIL` is where confirmation emails will be sent

### 4. Apple Calendar Sync

To sync with Apple Calendar:
1. Open Apple Calendar
2. Go to "Calendar" > "Preferences" > "Accounts"
3. Add your Google account
4. Enable calendar sync
5. Your Google Calendar events will now appear in Apple Calendar

## How It Works

### When a Booking is Created:

1. **Zoom Meeting**: A Zoom meeting is created with the consultation details
2. **Google Calendar Event**: An event is created in the photographer's Google Calendar with:
   - Event title: "Photography Consultation - [Client Name]"
   - Description: Client message and consultation details
   - Attendees: Both client and photographer
   - Zoom meeting link included
   - Reminders: 24 hours and 15 minutes before
3. **Email Notifications**: Both client and photographer receive emails with:
   - Meeting details
   - Zoom links
   - Calendar event link
   - Meeting password

### Email Templates

The system generates professional HTML email templates for:
- **Client Email**: Confirmation with meeting details and calendar link
- **Photographer Email**: Notification with client details and meeting links

## Testing

To test the integration:

1. Make sure all environment variables are set
2. Create a test booking through the admin dashboard
3. Check that:
   - Google Calendar event is created
   - Emails are logged to console (or sent if email service is configured)
   - Event appears in Apple Calendar (if synced)

## Troubleshooting

### Common Issues:

1. **"Google Calendar credentials are not properly configured"**
   - Check that all environment variables are set correctly
   - Ensure the private key includes the full key with headers

2. **"Calendar not found"**
   - Verify the calendar ID is correct
   - Ensure the service account has access to the calendar

3. **Events not syncing to Apple Calendar**
   - Check that Google account is added to Apple Calendar
   - Verify calendar sync is enabled

4. **Permission denied errors**
   - Make sure the service account has "Make changes to events" permission
   - Check that the Google Calendar API is enabled

## Security Notes

- Keep your service account JSON file secure
- Never commit environment variables to version control
- Use environment-specific service accounts for production
- Regularly rotate service account keys

## Next Steps

To complete the email integration:
1. Set up an email service (SendGrid, Mailgun, AWS SES)
2. Replace the console.log statements with actual email sending
3. Customize email templates as needed
4. Add email tracking and delivery confirmation 