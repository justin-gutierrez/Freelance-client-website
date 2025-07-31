'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getVisibleCollections, deleteCollectionAndImages } from '@/lib/firestore';
import { useSession, signIn, signOut } from 'next-auth/react';

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

interface AddCollectionForm {
  name: string;
  description: string;
  tags: string;
  images: FileList;
  coverIndex: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'create-booking' | 'bookings' | 'requests' | 'add-collection' | 'manage-collections'>('create-booking');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [collections, setCollections] = useState<any[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [collectionsError, setCollectionsError] = useState<string | null>(null);
  const [deletingCollectionId, setDeletingCollectionId] = useState<string | null>(null);
  const [collectionAddedSuccess, setCollectionAddedSuccess] = useState(false);

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateBookingForm>();

  const {
    register: registerCollection,
    handleSubmit: handleSubmitCollection,
    formState: { errors: errorsCollection },
    reset: resetCollection,
    watch: watchCollection,
    setValue: setValueCollection,
  } = useForm<AddCollectionForm>();
  const images = watchCollection('images');

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

  // Fetch collections for manage tab
  const fetchCollections = async () => {
    setCollectionsLoading(true);
    setCollectionsError(null);
    try {
      const data = await getVisibleCollections();
      setCollections(data);
    } catch {
      setCollectionsError('Failed to load collections.');
    } finally {
      setCollectionsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'manage-collections') {
      fetchCollections();
    }
  }, [activeTab]);

  // Add collection form submit handler (calls secure API route)
  const onSubmitAddCollection = async (data: AddCollectionForm) => {
    if (!data.images || data.images.length === 0) {
      alert('Please select at least one image.');
      return;
    }
    setLoading(true);
    setCollectionAddedSuccess(false);
    
    // Compress and convert images to WebP before upload
    const optimizedImages = await Promise.all(
      Array.from(data.images).map(async (file) => {
        return await optimizeImage(file, 0.85, 1920); // 85% quality, max 1920px width/height
      })
    );
    
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('slug', data.name.replace(/\s+/g, '-').toLowerCase());
    formData.append('description', data.description);
    formData.append('tags', data.tags);
    formData.append('coverIndex', String(data.coverIndex));
    formData.append('isVisible', 'true');
    // Add all optimized images
    optimizedImages.forEach((file, idx) => {
      formData.append('images', file, file.name.replace(/\.[^/.]+$/, '.webp'));
    });
    try {
      const res = await fetch('/api/admin/upload-collection', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setCollectionAddedSuccess(true);
        resetCollection();
        // Reset success state after 3 seconds
        setTimeout(() => setCollectionAddedSuccess(false), 3000);
      } else {
        alert('Failed to add collection.');
      }
    } catch (err) {
      alert('Failed to add collection.');
    } finally {
      setLoading(false);
    }
  };

  // Image optimization function (WebP conversion + compression)
  const optimizeImage = (file: File, quality: number, maxSize: number): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and convert to WebP
        ctx.drawImage(img, 0, 0, width, height);
        
        // Try WebP first, fallback to JPEG if not supported
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              resolve(optimizedFile);
            } else {
              // Fallback to JPEG if WebP is not supported
              canvas.toBlob(
                (jpegBlob) => {
                  if (jpegBlob) {
                    const jpegFile = new File([jpegBlob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
                      type: 'image/jpeg',
                      lastModified: Date.now(),
                    });
                    resolve(jpegFile);
                  } else {
                    resolve(file); // Fallback to original if all else fails
                  }
                },
                'image/jpeg',
                quality
              );
            }
          },
          'image/webp',
          quality
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Delete handler (calls secure API route)
  const handleDeleteCollection = async (collection: any) => {
    if (!window.confirm(`Are you sure you want to delete the collection "${collection.name}"? This cannot be undone.`)) return;
    setDeletingCollectionId(collection.id);
    try {
      const res = await fetch('/api/admin/delete-collection', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ collectionSlug: collection.slug }),
      });
      const result = await res.json();
      if (result.success) {
        setCollections((prev) => prev.filter((c) => c.id !== collection.id));
      } else {
        alert('Failed to delete collection.');
      }
    } catch {
      alert('Failed to delete collection.');
    } finally {
      setDeletingCollectionId(null);
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

  // Handle login form submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const result = await response.json();
      if (result.success) {
        setIsAuthenticated(true);
      } else {
        setLoginError(result.message || 'Invalid credentials');
      }
    } catch (error) {
      setLoginError('An error occurred. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const username = (form.elements.namedItem('username') as HTMLInputElement).value;
            const password = (form.elements.namedItem('password') as HTMLInputElement).value;
            await signIn('credentials', { username, password, callbackUrl: '/admin' });
          }}
          className="bg-white dark:bg-zinc-800 shadow-lg rounded-lg p-8 w-full max-w-md border border-gray-200 dark:border-zinc-700"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">Admin Login</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Username</label>
            <input
              type="text"
              name="username"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-zinc-700"
              placeholder="Enter admin username"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-zinc-700"
              placeholder="Enter admin password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg shadow-md hover:bg-gray-900 dark:hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

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
        <div className="flex justify-end mb-4">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded shadow hover:bg-gray-900 dark:hover:bg-gray-200 transition-colors"
          >
            Logout
          </button>
        </div>
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
          <button
            onClick={() => setActiveTab('add-collection')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'add-collection'
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Add Collection
          </button>
          <button
            onClick={() => setActiveTab('manage-collections')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'manage-collections'
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Manage Collections
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

        {activeTab === 'add-collection' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Add New Collection</h2>
              <form onSubmit={handleSubmitCollection(onSubmitAddCollection)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Name *</label>
                  <input
                    type="text"
                    {...registerCollection('name', { required: 'Name is required' })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 ${
                      errorsCollection.name ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-zinc-700'
                    }`}
                    placeholder="Collection name"
                  />
                  {errorsCollection.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errorsCollection.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Description *</label>
                  <textarea
                    {...registerCollection('description', { required: 'Description is required' })}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 ${
                      errorsCollection.description ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-zinc-700'
                    }`}
                    placeholder="Describe this collection"
                  />
                  {errorsCollection.description && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errorsCollection.description.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    {...registerCollection('tags')}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-zinc-700"
                    placeholder="e.g. wedding, outdoor, candid"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Images *</label>
                  <input
                    type="file"
                    {...registerCollection('images', { required: 'At least one image is required' })}
                    accept="image/*"
                    multiple
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-zinc-700"
                  />
                  {errorsCollection.images && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errorsCollection.images.message}</p>
                  )}
                  {images && images.length > 0 && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Select Cover Image</label>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(images).map((file, idx) => (
                          <label key={idx} className="flex flex-col items-center cursor-pointer">
                            <input
                              type="radio"
                              {...registerCollection('coverIndex', { required: 'Select a cover image' })}
                              value={idx}
                              className="mb-1"
                            />
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${file.name}`}
                              className="w-16 h-16 object-cover rounded border border-gray-300 dark:border-zinc-700"
                            />
                            <span className="text-xs mt-1 text-gray-600 dark:text-gray-300 truncate w-16">{file.name}</span>
                          </label>
                        ))}
                      </div>
                      {errorsCollection.coverIndex && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errorsCollection.coverIndex.message}</p>
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className={`w-full px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                    collectionAddedSuccess
                      ? 'bg-green-600 text-white'
                      : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
                  }`}
                  disabled={loading}
                >
                  {collectionAddedSuccess 
                    ? 'Added Successfully!' 
                    : loading 
                      ? 'Adding Collection...' 
                      : 'Add Collection'
                  }
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'manage-collections' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Manage Collections</h2>
              {collectionsLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[20vh]">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mb-2"></div>
                  <p className="text-black dark:text-white">Loading collections...</p>
                </div>
              ) : collectionsError ? (
                <div className="text-red-600 dark:text-red-400 text-center">{collectionsError}</div>
              ) : collections.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No collections found.</p>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-zinc-700">
                  {collections.map((col) => (
                    <li key={col.id} className="flex items-center justify-between py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{col.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{col.description}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteCollection(col)}
                        disabled={deletingCollectionId === col.id}
                        className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        {deletingCollectionId === col.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 