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

// Helper function to get bookings for a specific date
export function getBookingsForDate(date: Date) {
  const dateString = date.toDateString();
  return bookings.filter(booking => {
    const bookingDate = new Date(booking.startTime);
    return bookingDate.toDateString() === dateString;
  });
}

// Helper function to check if a specific time slot is available
export function isTimeSlotAvailable(date: Date, hour: number) {
  const dateString = date.toDateString();
  const targetTime = new Date(date);
  targetTime.setHours(hour, 0, 0, 0);
  
  return !bookings.some(booking => {
    const bookingDate = new Date(booking.startTime);
    return bookingDate.toDateString() === dateString && 
           bookingDate.getHours() === hour;
  });
}

// Helper function to get available time slots for a specific date
export function getAvailableTimeSlots(date: Date) {
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM
  const availableSlots = [];
  
  for (let hour = startHour; hour < endHour; hour++) {
    if (isTimeSlotAvailable(date, hour)) {
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);
      
      const slotEnd = new Date(slotStart);
      slotEnd.setHours(slotStart.getHours() + 1);
      
      availableSlots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        time: slotStart.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
        hour: hour
      });
    }
  }
  
  return availableSlots;
}

// Helper function to delete a booking (for admin use)
export function deleteBooking(bookingId: string) {
  const index = bookings.findIndex(booking => booking.id === bookingId);
  if (index !== -1) {
    bookings.splice(index, 1);
    return true;
  }
  return false;
}

// Helper function to update a booking (for admin use)
export function updateBooking(bookingId: string, updates: Partial<typeof bookings[0]>) {
  const index = bookings.findIndex(booking => booking.id === bookingId);
  if (index !== -1) {
    bookings[index] = { ...bookings[index], ...updates };
    return true;
  }
  return false;
} 