import jwt from 'jsonwebtoken';

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

/**
 * Generate JWT token for Zoom API authentication
 */
function generateZoomJWT(): string {
  const payload = {
    iss: process.env.ZOOM_API_KEY,
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiration
  };
  
  if (!process.env.ZOOM_API_SECRET) {
    throw new Error('ZOOM_API_SECRET environment variable is not set');
  }
  
  return jwt.sign(payload, process.env.ZOOM_API_SECRET);
}

/**
 * Create a Zoom meeting for a guest
 * @param guestName - Name of the guest for the meeting
 * @param options - Optional meeting configuration
 * @returns Zoom meeting details including join URL
 */
export async function createZoomMeeting(
  guestName: string,
  options: CreateZoomMeetingOptions = {}
): Promise<ZoomMeetingResponse> {
  try {
    if (!process.env.ZOOM_API_KEY) {
      throw new Error('ZOOM_API_KEY environment variable is not set');
    }

    const token = generateZoomJWT();
    
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
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(meetingData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Zoom API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const meeting = await response.json();
    
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

/**
 * Get meeting details by meeting ID
 * @param meetingId - Zoom meeting ID
 * @returns Meeting details
 */
export async function getZoomMeeting(meetingId: number): Promise<ZoomMeetingResponse> {
  try {
    const token = generateZoomJWT();
    
    const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Zoom API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const meeting = await response.json();
    
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

/**
 * Delete a Zoom meeting
 * @param meetingId - Zoom meeting ID
 */
export async function deleteZoomMeeting(meetingId: number): Promise<void> {
  try {
    const token = generateZoomJWT();
    
    const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
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