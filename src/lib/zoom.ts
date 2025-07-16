import fetch from 'node-fetch';

interface ZoomMeetingResponse {
  id: number;
  join_url: string;
  start_url: string;
  password: string;
  topic: string;
  start_time: string;
  duration: number;
  settings: {
    host_video: boolean;
    participant_video: boolean;
    join_before_host: boolean;
    mute_upon_entry: boolean;
    watermark: boolean;
    use_pmi: boolean;
    approval_type: number;
    audio: string;
    auto_recording: string;
  };
}

interface CreateZoomMeetingOptions {
  topic?: string;
  startTime?: string;
  duration?: number; // in minutes
  password?: string;
}

// Helper to fetch and cache OAuth token
let zoomOAuthToken: string | null = null;
let zoomOAuthTokenExpiry: number | null = null;

async function getZoomOAuthToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (zoomOAuthToken && zoomOAuthTokenExpiry && now < zoomOAuthTokenExpiry - 60) {
    return zoomOAuthToken;
  }
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;
  if (!accountId || !clientId || !clientSecret) {
    throw new Error('Zoom OAuth credentials are not set in environment variables');
  }
  const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch Zoom OAuth token: ${response.status} ${response.statusText} - ${errorText}`);
  }
  const data = (await response.json()) as { access_token: string; expires_in: number };
  zoomOAuthToken = data.access_token;
  zoomOAuthTokenExpiry = now + data.expires_in;
  return zoomOAuthToken;
}

export async function createZoomMeeting(
  guestName: string,
  options: CreateZoomMeetingOptions = {}
): Promise<ZoomMeetingResponse> {
  try {
    const token = await getZoomOAuthToken();
    // Default meeting settings
    const defaultStartTime = new Date();
    defaultStartTime.setMinutes(defaultStartTime.getMinutes() + 5); // Start 5 minutes from now
    const meetingData = {
      topic: options.topic || `Photography Consultation - ${guestName}`,
      type: 2, // Scheduled meeting
      start_time: options.startTime || defaultStartTime.toISOString(),
      duration: options.duration || 60, // 1 hour default
      password: options.password,
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: true,
        mute_upon_entry: false,
        watermark: false,
        use_pmi: false,
        approval_type: 0, // Automatically approve
        audio: 'both',
        auto_recording: 'none',
        waiting_room: false,
        meeting_authentication: false,
      },
    };
    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(meetingData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Zoom API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const meeting = (await response.json()) as any;
    return {
      id: meeting.id,
      join_url: meeting.join_url,
      start_url: meeting.start_url,
      password: meeting.password,
      topic: meeting.topic,
      start_time: meeting.start_time,
      duration: meeting.duration,
      settings: meeting.settings,
    };
  } catch (error) {
    console.error('Error creating Zoom meeting:', error);
    throw error;
  }
}

export async function getZoomMeeting(meetingId: number): Promise<ZoomMeetingResponse> {
  try {
    const token = await getZoomOAuthToken();
    const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Zoom API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const meeting = (await response.json()) as any;
    return {
      id: meeting.id,
      join_url: meeting.join_url,
      start_url: meeting.start_url,
      password: meeting.password,
      topic: meeting.topic,
      start_time: meeting.start_time,
      duration: meeting.duration,
      settings: meeting.settings,
    };
  } catch (error) {
    console.error('Error getting Zoom meeting:', error);
    throw error;
  }
}

export async function deleteZoomMeeting(meetingId: number): Promise<void> {
  try {
    const token = await getZoomOAuthToken();
    const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Zoom API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
  } catch (error) {
    console.error('Error deleting Zoom meeting:', error);
    throw error;
  }
} 