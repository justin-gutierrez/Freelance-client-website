'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import CustomCalendar from '@/components/CustomCalendar';

interface BookingFormData {
  name: string;
  email: string;
  message: string;
}

interface ConsultationRequestData {
  name: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
}

type BookingType = 'scheduled' | 'request';

export default function BookingPage() {
  const [bookingType, setBookingType] = useState<BookingType>('scheduled');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string>('');
  const [calendarKey, setCalendarKey] = useState(0); // Force calendar refresh

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BookingFormData>();

  const {
    register: registerRequest,
    handleSubmit: handleSubmitRequest,
    formState: { errors: errorsRequest },
    reset: resetRequest,
  } = useForm<ConsultationRequestData>();

  // Handle date selection for scheduled consultations
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(''); // Reset time selection
  };

  // Handle time slot selection for scheduled consultations
  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  // Handle scheduled consultation form submission
  const onSubmitScheduled = async (data: BookingFormData) => {
    if (!selectedTimeSlot) {
      setBookingError('Please select a time slot');
      return;
    }

    setBookingLoading(true);
    setBookingError('');

    try {
      const response = await fetch('/api/book-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          selectedTime: selectedTimeSlot,
          bookingType: 'scheduled',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setBookingSuccess(true);
        reset(); // Reset form
        setSelectedDate(null);
        setSelectedTimeSlot('');
        
        // Force calendar to refresh availability
        setCalendarKey(prev => prev + 1);
      } else {
        setBookingError(result.message || 'Booking failed');
      }
    } catch (error) {
      setBookingError('An error occurred while booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Handle consultation request form submission
  const onSubmitRequest = async (data: ConsultationRequestData) => {
    setBookingLoading(true);
    setBookingError('');

    try {
      const response = await fetch('/api/consultation-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          bookingType: 'request',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setBookingSuccess(true);
        resetRequest(); // Reset form
      } else {
        setBookingError(result.message || 'Request failed');
      }
    } catch (error) {
      setBookingError('An error occurred while submitting your request. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Format time for display
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Book a Consultation</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose how you&apos;d like to connect with me for your photography consultation.
          </p>
        </div>

        {bookingSuccess && (
          <div className="mb-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                  {bookingType === 'scheduled' ? 'Booking Confirmed!' : 'Request Submitted!'}
                </h3>
                <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                  {bookingType === 'scheduled' 
                    ? 'Your consultation has been booked successfully. Check your email for meeting details.'
                    : 'Your consultation request has been submitted. I&apos;ll get back to you within 24 hours.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Booking Type Selection */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setBookingType('scheduled')}
              className={`p-6 rounded-lg border-2 transition-all ${
                bookingType === 'scheduled'
                  ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                  : 'border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-zinc-600'
              }`}
            >
              <h3 className="text-xl font-semibold mb-2">Scheduled Consultation</h3>
              <p className="text-sm opacity-80">
                Book a consultation on Wednesdays between 9 AM - 5 PM. Get instant confirmation and Zoom meeting details.
              </p>
            </button>

            <button
              onClick={() => setBookingType('request')}
              className={`p-6 rounded-lg border-2 transition-all ${
                bookingType === 'request'
                  ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                  : 'border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-zinc-600'
              }`}
            >
              <h3 className="text-xl font-semibold mb-2">Consultation Request</h3>
              <p className="text-sm opacity-80">
                Submit a request for any date/time. I&apos;ll review and get back to you within 24 hours to coordinate.
              </p>
            </button>
          </div>
        </div>

        {bookingType === 'scheduled' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar Section */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Select a Date & Time</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Available Wednesdays 9 AM - 5 PM
              </p>
              
              <CustomCalendar
                key={calendarKey} // Force re-render when key changes
                selectedDate={selectedDate}
                onDateSelect={handleDateChange}
                onTimeSelect={handleTimeSlotSelect}
                selectedTimeSlot={selectedTimeSlot}
              />
            </div>

            {/* Booking Form */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Booking Details</h2>
              
              <form onSubmit={handleSubmit(onSubmitScheduled)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name', { 
                      required: 'Full name is required' 
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 ${
                      errors.name 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-zinc-700'
                    }`}
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 ${
                      errors.email 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-zinc-700'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    {...register('message')}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
                    placeholder="Tell me about your vision, special requirements, or any questions you have..."
                  />
                </div>

                {selectedTimeSlot && (
                  <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Selected Time</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {new Date(selectedTimeSlot).toLocaleDateString()} at {formatTime(selectedTimeSlot)}
                    </p>
                  </div>
                )}

                {bookingError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-sm text-red-700 dark:text-red-300">{bookingError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={bookingLoading || !selectedTimeSlot}
                  className="w-full bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bookingLoading ? 'Booking...' : 'Book Consultation'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Consultation Request Form */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Consultation Request</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Submit your consultation request and I&apos;ll get back to you within 24 hours to coordinate a time that works for both of us.
              </p>
              
              <form onSubmit={handleSubmitRequest(onSubmitRequest)} className="space-y-6">
                <div>
                  <label htmlFor="request-name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="request-name"
                    {...registerRequest('name', { 
                      required: 'Full name is required' 
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 ${
                      errorsRequest.name 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-zinc-700'
                    }`}
                    placeholder="Your full name"
                  />
                  {errorsRequest.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errorsRequest.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="request-email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="request-email"
                    {...registerRequest('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 ${
                      errorsRequest.email 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-zinc-700'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errorsRequest.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errorsRequest.email.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="preferred-date" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      id="preferred-date"
                      {...registerRequest('preferredDate')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label htmlFor="preferred-time" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      id="preferred-time"
                      {...registerRequest('preferredTime')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="request-message" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="request-message"
                    {...registerRequest('message', { 
                      required: 'Please tell us about your photography needs' 
                    })}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 ${
                      errorsRequest.message 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-zinc-700'
                    }`}
                    placeholder="Tell me about your photography project, vision, timeline, budget, and any specific requirements or questions you have..."
                  />
                  {errorsRequest.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errorsRequest.message.message}
                    </p>
                  )}
                </div>

                {bookingError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-sm text-red-700 dark:text-red-300">{bookingError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bookingLoading ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Other Ways to Reach Me</h3>
          <div className="flex justify-center space-x-8 text-gray-600 dark:text-gray-300">
            <div>
              <p className="font-medium">Email</p>
              <p>hello@photographer.com</p>
            </div>
            <div>
              <p className="font-medium">Phone</p>
              <p>(555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 