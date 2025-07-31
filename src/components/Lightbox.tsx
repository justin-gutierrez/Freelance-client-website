'use client';

import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface Photo {
  id: string;
  title: string;
  url: string;
  alt?: string;
}

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  photos: Photo[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ isOpen, onClose, photos, currentIndex, onNavigate }: LightboxProps) {
  const currentPhoto = photos[currentIndex];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        onNavigate(Math.max(0, currentIndex - 1));
        break;
      case 'ArrowRight':
        event.preventDefault();
        onNavigate(Math.min(photos.length - 1, currentIndex + 1));
        break;
    }
  }, [isOpen, onClose, onNavigate, currentIndex, photos.length]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handlePrevious = () => {
    onNavigate(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    onNavigate(Math.min(photos.length - 1, currentIndex + 1));
  };

  if (!isOpen || !currentPhoto) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4 dark:bg-black dark:bg-opacity-95"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      aria-describedby="lightbox-description"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white hover:text-gray-300 dark:hover:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-lg"
        aria-label="Close lightbox"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 text-white hover:text-gray-300 dark:hover:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-lg bg-black bg-opacity-50 dark:bg-zinc-900 dark:bg-opacity-70 hover:bg-opacity-70"
          aria-label="Previous photo"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {currentIndex < photos.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 text-white hover:text-gray-300 dark:hover:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-lg bg-black bg-opacity-50 dark:bg-zinc-900 dark:bg-opacity-70 hover:bg-opacity-70"
          aria-label="Next photo"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Main Content */}
      <div className="relative max-w-5xl w-full flex flex-col">
        {/* Image Container */}
        <div className="flex items-center justify-center relative overflow-auto">
          <div className="relative flex items-center justify-center p-4">
            <img
              src={currentPhoto.url}
              alt={currentPhoto.alt || currentPhoto.title}
              loading="lazy"
              className="object-contain rounded-lg"
              style={{ 
                maxWidth: '90%', 
                maxHeight: '85vh', 
                height: 'auto',
                width: 'auto'
              }}
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="bg-gray-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                      <div class="text-gray-500 dark:text-gray-300 text-center p-8">
                        <div class="text-6xl mb-4">📸</div>
                        <p class="text-lg">${currentPhoto.title}</p>
                        <p class="text-sm mt-2">Photo ${currentIndex + 1} of ${photos.length}</p>
                      </div>
                    </div>
                  `;
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Keyboard Navigation Hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white dark:text-gray-300 text-sm opacity-70">
        Use arrow keys to navigate, Escape to close
      </div>
    </div>,
    document.body
  );
} 