'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  startTime: string;
  endTime: string;
  message: string;
  zoomMeetingId: string;
}

interface ConsultationRequest {
  id: string;
  name: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface CreateBookingForm {
  guestName: string;
  guestEmail: string;
  date: string;
  time: string;
  message: string;
}

export default function AdminPage() {
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'create-booking' | 'bookings' | 'requests'>('create-booking');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateBookingForm>();

  // Fetch upcoming bookings and consultation requests
  useEffect(() => {
    fetchUpcomingBookings();
    fetchConsultationRequests();
  }, []);

  const fetchUpcomingBookings = async () => {
    try {
      const response = await fetch('/api/admin/bookings');
      if (response.ok) {
        const data = await response.json();
        setUpcomingBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchConsultationRequests = async () => {
    try {
      const response = await fetch('/api/admin/consultation-requests');
      if (response.ok) {
        const data = await response.json();
        setConsultationRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Error fetching consultation requests:', error);
    }
  };

  const onSubmitCreateBooking = async (data: CreateBookingForm) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/create-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        reset();
        fetchUpcomingBookings();
        alert('Booking created successfully! Google Calendar event created, Zoom meeting scheduled, and confirmation emails sent to both client and photographer.');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      alert('Error creating booking');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Admin Dashboard</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Manage bookings and consultation requests
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white dark:bg-zinc-800 rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab('create-booking')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'create-booking'
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Create Booking Confirmation
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'bookings'
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Upcoming Bookings
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'requests'
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Consultation Requests
          </button>
        </div>

        {activeTab === 'create-booking' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Create Booking Confirmation</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Manually create a booking confirmation. This will create a Zoom meeting and send confirmation emails to both the client and photographer.
              </p>
              
              <form onSubmit={handleSubmit(onSubmitCreateBooking)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    {...register('guestName', { required: 'Client name is required' })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 ${
                      errors.guestName ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-zinc-700'
                    }`}
                    placeholder="Client's full name"
                  />
                  {errors.guestName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.guestName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Client Email *
                  </label>
                  <input
                    type="email"
                    {...register('guestEmail', { 
                      required: 'Client email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 ${
                      errors.guestEmail ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-zinc-700'
                    }`}
                    placeholder="client@example.com"
                  />
                  {errors.guestEmail && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.guestEmail.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      {...register('date', { required: 'Date is required' })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 ${
                        errors.date ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-zinc-700'
                      }`}
                    />
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      {...register('time', { required: 'Time is required' })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 ${
                        errors.time ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-zinc-700'
                      }`}
                    />
                    {errors.time && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.time.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Consultation Notes
                  </label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
                    placeholder="Any notes about the consultation, project details, or special requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating Booking...' : 'Create Booking Confirmation'}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Upcoming Bookings</h2>
            
            {upcomingBookings.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No upcoming bookings
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                  <thead className="bg-gray-50 dark:bg-zinc-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Guest
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                    {upcomingBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {booking.guestName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {booking.guestEmail}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {formatDateTime(booking.startTime)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                          <div className="max-w-xs truncate">
                            {booking.message || 'No message'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <a
                            href={`https://zoom.us/j/${booking.zoomMeetingId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          >
                            Join Meeting
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Consultation Requests</h2>
            
            {consultationRequests.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No consultation requests
              </p>
            ) : (
              <div className="space-y-4">
                {consultationRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {request.name}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            request.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : request.status === 'approved'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {request.email}
                        </p>
                        {request.preferredDate && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                            Preferred: {formatDate(request.preferredDate)} at {request.preferredTime}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {request.message}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                          Submitted: {formatDateTime(request.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 