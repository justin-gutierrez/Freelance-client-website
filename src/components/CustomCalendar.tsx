'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface CustomCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (timeSlot: string) => void;
  selectedTimeSlot: string;
}

export default function CustomCalendar({
  selectedDate,
  onDateSelect,
  onTimeSelect,
  selectedTimeSlot,
}: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<Array<{ start: string; end: string }>>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Generate available time slots for Wednesdays 9 AM - 5 PM
  useEffect(() => {
    const generateWednesdaySlots = () => {
      setLoadingSlots(true);
      
      const slots: Array<{ start: string; end: string }> = [];
      const today = new Date();
      
      // Generate slots for the next 8 weeks (8 Wednesdays)
      for (let week = 0; week < 8; week++) {
        const wednesday = new Date(today);
        wednesday.setDate(today.getDate() + (3 - today.getDay() + 7) % 7 + (week * 7));
        
        // Only include Wednesdays that are in the future
        if (wednesday > today) {
          // Generate time slots from 9 AM to 5 PM (1-hour slots)
          for (let hour = 9; hour < 17; hour++) {
            const slotStart = new Date(wednesday);
            slotStart.setHours(hour, 0, 0, 0);
            
            const slotEnd = new Date(slotStart);
            slotEnd.setHours(slotStart.getHours() + 1);
            
            slots.push({
              start: slotStart.toISOString(),
              end: slotEnd.toISOString(),
            });
          }
        }
      }
      
      setAvailableSlots(slots);
      setLoadingSlots(false);
    };

    generateWednesdaySlots();
  }, []);

  // Get available slots for a specific date
  const getAvailableSlotsForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return availableSlots.filter((slot: { start: string; end: string }) => {
      const slotDate = new Date(slot.start);
      return slotDate.toDateString() === dateStr;
    });
  };

  // Check if date has available slots (only Wednesdays)
  const hasAvailableSlots = (date: Date) => {
    // Only Wednesdays (day 3) can have slots
    if (date.getDay() !== 3) return false;
    
    // Check if it's in the future
    const today = new Date();
    if (date <= today) return false;
    
    return getAvailableSlotsForDate(date).length > 0;
  };

  // Format time for display
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today;
      const hasSlots = hasAvailableSlots(date);
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const isWednesday = date.getDay() === 3;
      
      days.push({
        date,
        isCurrentMonth,
        isToday,
        isPast,
        hasSlots,
        isSelected,
        isWednesday,
        slotCount: getAvailableSlotsForDate(date).length,
      });
    }
    
    return days;
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  const days = getCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
        >
          <ChevronRightIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => {
              if (day.hasSlots && !day.isPast) {
                onDateSelect(day.date);
              }
            }}
            disabled={!day.hasSlots || day.isPast}
            className={`
              relative p-3 text-sm rounded-lg transition-all duration-200
              ${day.isCurrentMonth 
                ? 'text-gray-900 dark:text-gray-100' 
                : 'text-gray-400 dark:text-gray-600'
              }
              ${day.isToday 
                ? 'ring-2 ring-black dark:ring-white' 
                : ''
              }
              ${day.isSelected 
                ? 'bg-black dark:bg-white text-white dark:text-black' 
                : day.hasSlots && !day.isPast
                ? 'hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer'
                : 'cursor-not-allowed opacity-50'
              }
              ${day.isPast 
                ? 'opacity-30' 
                : ''
              }
            `}
          >
            <span className="block">{day.date.getDate()}</span>
            
            {/* Wednesday indicator */}
            {day.isWednesday && !day.isPast && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                <div className={`w-2 h-2 rounded-full ${
                  day.hasSlots ? 'bg-green-500' : 'bg-gray-300 dark:bg-zinc-600'
                }`}></div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Available Times for {selectedDate.toLocaleDateString()}
          </h3>
          
          {loadingSlots ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                {getAvailableSlotsForDate(selectedDate).map((slot: { start: string; end: string }, index: number) => (
                  <button
                    key={index}
                    onClick={() => onTimeSelect(slot.start)}
                    className={`
                      p-4 text-sm rounded-lg border transition-all duration-200
                      ${selectedTimeSlot === slot.start
                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-lg'
                        : 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-zinc-700 hover:border-black dark:hover:border-white hover:shadow-md'
                      }
                    `}
                  >
                    {formatTime(slot.start)}
                  </button>
                ))}
              </div>
              
              {getAvailableSlotsForDate(selectedDate).length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No available slots for this date
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-zinc-700">
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Available Wednesday</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-300 dark:bg-zinc-600 rounded-full"></div>
            <span>Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
} 