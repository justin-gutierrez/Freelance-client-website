'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import Lightbox from '@/components/Lightbox';
import { getCollectionBySlug } from '@/lib/firestore';

interface Collection {
  id: string;
  name: string;
  description: string;
  slug: string;
  isVisible: boolean;
  tags?: string[];
  coverImageUrl?: string;
  images?: Array<{
    id: string;
    title: string;
    url: string;
    alt: string;
  }>;
}

interface CollectionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageOrientations, setImageOrientations] = useState<{[key: string]: 'portrait' | 'landscape'}>({});

  // Load collection data
  useEffect(() => {
    const loadCollection = async () => {
      try {
        setLoading(true);
        setError(null);
        const resolvedParams = await params;
        console.log('Loading collection with slug:', resolvedParams.id);
        const { collection: collectionData, images } = await getCollectionBySlug(resolvedParams.id);
        console.log('Fetched collection data:', collectionData);
        console.log('Fetched images:', images);
        
        if (!collectionData) {
          setError('Collection not found.');
          return;
        }
        
        setCollection({
          id: collectionData.id || resolvedParams.id,
          name: collectionData.name || 'Untitled Collection',
          description: collectionData.description || '',
          slug: collectionData.slug || resolvedParams.id,
          isVisible: collectionData.isVisible ?? true,
          tags: collectionData.tags || [],
          coverImageUrl: collectionData.coverImageUrl || '',
          images
        });
      } catch (err) {
        console.error('Error loading collection:', err);
        setError('Collection not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    loadCollection();
  }, [params]);

  const handleImageLoad = (photoId: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    const orientation = img.naturalWidth > img.naturalHeight ? 'landscape' : 'portrait';
    setImageOrientations(prev => ({
      ...prev,
      [photoId]: orientation
    }));
    console.log(`✅ Image loaded successfully: ${img.src} (${orientation})`);
    
    // Hide loading indicator
    const loadingDiv = img.parentElement?.querySelector('div');
    if (loadingDiv) {
      loadingDiv.style.display = 'none';
    }
  };

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigateLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg font-semibold mb-4">{error || 'Collection not found.'}</p>
          <Link 
            href="/"
            className="inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Back to Collections
          </Link>
        </div>
      </div>
    );
  }

  const photos = collection.images || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 pt-16">
      {/* Collection Header */}
      <div className="bg-white dark:bg-zinc-800 shadow-sm border-b border-gray-200 dark:border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                href="/"
                className="inline-flex items-center text-sm text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 mb-2"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Collections
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{collection.name}</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-3xl">{collection.description}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <span>{photos.length} photos</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex flex-wrap gap-2">
                {collection.tags && collection.tags.slice(0, 5).map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {collection.tags && collection.tags.length > 5 && (
                  <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 text-sm rounded-full">
                    +{collection.tags.length - 5}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
          {photos.map((photo, index) => (
            <div key={photo.id} className="group break-inside-avoid">
              <div className="relative overflow-hidden rounded-lg bg-white dark:bg-zinc-800 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                {/* Photo */}
                <button
                  onClick={() => openLightbox(index)}
                  className={`w-full bg-gradient-to-br from-gray-200 dark:from-zinc-700 to-gray-300 dark:to-zinc-800 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 relative overflow-hidden`}
                  style={{
                    aspectRatio: imageOrientations[photo.id] === 'landscape' ? '4/3' : '3/4'
                  }}
                  aria-label={`Open ${photo.title} in lightbox`}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-300">
                    <div className="text-center">
                      <div className="text-2xl mb-2">📸</div>
                      <p className="text-xs">Loading...</p>
                    </div>
                  </div>
                  <img
                    src={photo.url}
                    alt={photo.alt || photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 relative z-10"
                    onLoad={(e) => handleImageLoad(photo.id, e)}
                    onError={(e) => {
                      console.error(`❌ Image failed to load: ${photo.url}`);
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="text-gray-500 dark:text-gray-300 text-center">
                            <div class="text-4xl mb-2">📸</div>
                            <p class="text-sm">${photo.title}</p>
                            <p class="text-xs text-red-500 mt-2">Failed to load</p>
                            <p class="text-xs text-gray-400">${photo.url}</p>
                          </div>
                        `;
                      }
                    }}
                  />
                </button>
                
                {/* Photo Info Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                    <h3 className="text-white font-semibold text-lg mb-2">{photo.title}</h3>
                    <button 
                      onClick={() => openLightbox(index)}
                      className="bg-white dark:bg-zinc-900 text-black dark:text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      View Full Size
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Collection Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">About This Collection</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{collection.description}</p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {collection.tags && collection.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link 
              href="/booking"
              className="inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Book a Similar Session
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        photos={photos}
        currentIndex={currentPhotoIndex}
        onNavigate={navigateLightbox}
      />
    </div>
  );
}