'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import Lightbox from '@/components/Lightbox';
import OptimizedImage from '@/components/OptimizedImage';
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {photos.map((photo, index) => (
            <div key={photo.id} className="group">
              <div className="relative overflow-hidden rounded-lg bg-white dark:bg-zinc-800 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                <div onClick={() => openLightbox(index)} className="cursor-pointer">
                  <OptimizedImage
                    src={photo.url}
                    alt={photo.alt || photo.title}
                    width={400}
                    height={256}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    priority={index === 0}
                  />
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