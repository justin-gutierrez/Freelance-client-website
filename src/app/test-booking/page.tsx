'use client';

import React, { useState } from 'react';
import CustomCalendar from '@/components/CustomCalendar';

export default function TestBookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [testBookings, setTestBookings] = useState<Array<{
    id: string;
    guestName: string;
    startTime: string;
    endTime: string;
  }>>([]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot('');
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  // Simulate creating a test booking
  const createTestBooking = async () => {
    if (!selectedTimeSlot) {
      alert('Please select a time slot first');
      return;
    }

    const testBooking = {
      id: `test-${Date.now()}`,
      guestName: `Test User ${testBookings.length + 1}`,
      startTime: selectedTimeSlot,
      endTime: new Date(new Date(selectedTimeSlot).getTime() + 60 * 60 * 1000).toISOString(),
    };

    // Add to local test bookings
    setTestBookings(prev => [...prev, testBooking]);

    // Simulate API call to book-session
    try {
      const response = await fetch('/api/book-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: testBooking.guestName,
          email: `test${testBookings.length + 1}@example.com`,
          message: 'This is a test booking',
          selectedTime: selectedTimeSlot,
          bookingType: 'scheduled',
        }),
      });

      if (response.ok) {
        alert('Test booking created successfully! Check the calendar to see the slot is now unavailable.');
        // Reset selection
        setSelectedDate(null);
        setSelectedTimeSlot('');
      } else {
        alert('Test booking failed. Check console for details.');
      }
    } catch (error) {
      console.error('Test booking error:', error);
      alert('Test booking failed. Check console for details.');
    }
  };

  const clearTestBookings = () => {
    setTestBookings([]);
    setSelectedDate(null);
    setSelectedTimeSlot('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Real-Time Booking Test
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Test the real-time availability system. Create test bookings to see how the calendar updates automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Live Calendar
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Available Wednesdays 9 AM - 5 PM
            </p>
            
            <CustomCalendar
              selectedDate={selectedDate}
              onDateSelect={handleDateChange}
              onTimeSelect={handleTimeSlotSelect}
              selectedTimeSlot={selectedTimeSlot}
            />
          </div>

          {/* Test Controls */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Test Controls
            </h2>
            
            <div className="space-y-6">
              {/* Selected Time Display */}
              {selectedTimeSlot && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                    Selected Time
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300">
                    {new Date(selectedTimeSlot).toLocaleDateString()} at{' '}
                    {new Date(selectedTimeSlot).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                </div>
              )}

              {/* Create Test Booking Button */}
              <button
                onClick={createTestBooking}
                disabled={!selectedTimeSlot}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Test Booking
              </button>

              {/* Clear Test Bookings Button */}
              <button
                onClick={clearTestBookings}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Clear All Test Bookings
              </button>

              {/* Test Bookings List */}
              {testBookings.length > 0 && (
                <div className="border-t border-gray-200 dark:border-zinc-700 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Test Bookings Created ({testBookings.length})
                  </h4>
                  <div className="space-y-2">
                    {testBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-zinc-900/50 rounded p-2"
                      >
                        <strong>{booking.guestName}</strong> -{' '}
                        {new Date(booking.startTime).toLocaleDateString()} at{' '}
                        {new Date(booking.startTime).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-200 mb-2">
                How to Test:
              </h4>
              <ol className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-decimal list-inside">
                <li>Select a Wednesday date on the calendar</li>
                <li>Choose an available time slot</li>
                <li>Click "Create Test Booking"</li>
                <li>Watch the calendar update in real-time</li>
                <li>The booked slot will now show as unavailable</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Real-Time Features Explanation */}
        <div className="mt-12 bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Real-Time Features Implemented
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                ✅ What Works Now
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Real-time availability checking via API</li>
                <li>• Automatic filtering of booked time slots</li>
                <li>• Visual distinction between available and booked slots</li>
                <li>• Calendar refreshes after new bookings</li>
                <li>• Prevents double-bookings</li>
                <li>• Admin dashboard refresh functionality</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                🔄 How It Works
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Calendar fetches availability from `/api/available-times`</li>
                <li>• API checks actual bookings in the system</li>
                <li>• Only shows truly available time slots</li>
                <li>• Updates automatically when bookings are made</li>
                <li>• Uses enhanced bookings library for efficiency</li>
                <li>• Handles errors gracefully with retry options</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
