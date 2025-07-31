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

// Helper function to add a new booking
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

// Helper function to get all bookings
export function getAllBookings() {
  return bookings;
}

// Helper function to get future bookings only
export function getFutureBookings() {
  const now = new Date();
  return bookings.filter(booking => 
    new Date(booking.startTime) > now
  );
} 