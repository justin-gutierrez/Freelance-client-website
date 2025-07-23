'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Lightbox from '@/components/Lightbox';
import Fuse from 'fuse.js';
import { useSearchStore } from '@/lib/useSearchStore';
import CollectionGrid from '@/components/CollectionGrid';
import { getVisibleCollections, getCollectionBySlug, Collection, CollectionImage } from '@/lib/firestore';

export default function HomePage() {
  const search = useSearchStore((state) => state.search);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCollections, setVisibleCollections] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<CollectionImage[]>([]);

  // Fetch collections from Firestore
  useEffect(() => {
    setLoading(true);
    setError(null);
    getVisibleCollections()
      .then(data => {
        setCollections(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load collections. Please try again later.');
        setLoading(false);
      });
  }, []);

  // Fuzzy search setup
  const fuse = useMemo(() => new Fuse(collections, {
    keys: ['title', 'description', 'tags', 'category', 'location'],
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 2,
  }), [collections]);

  const filteredCollections = useMemo(() => {
    if (!search.trim()) return collections;
    return fuse.search(search).map(result => result.item);
  }, [search, fuse, collections]);

  // Infinite scroll (only applies to filtered results)
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
        if (!isLoading && visibleCollections < filteredCollections.length) {
          setIsLoading(true);
          setTimeout(() => {
            setVisibleCollections(prev => Math.min(prev + 6, filteredCollections.length));
            setIsLoading(false);
          }, 500);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCollections, isLoading, filteredCollections.length]);

  // Reset visibleCollections when search changes
  useEffect(() => {
    setVisibleCollections(12);
  }, [search]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mb-4"></div>
        <p className="text-black dark:text-white">Loading collections...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <p className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">{error}</p>
        <button
          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded shadow hover:bg-gray-900 dark:hover:bg-gray-200 transition-colors"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  const openLightbox = async (collection: Collection) => {
    setCurrentCollection(collection);
    setCurrentPhotoIndex(0);
    try {
      const { images } = await getCollectionBySlug(collection.slug);
      setLightboxImages(images);
      setLightboxOpen(true);
    } catch {
      setLightboxImages([]);
      setLightboxOpen(false);
      setError('Failed to load images for this collection.');
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentCollection(null);
    setLightboxImages([]);
  };

  const navigateLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CollectionGrid collections={filteredCollections.slice(0, visibleCollections)} onPreview={openLightbox} />
        {/* Loading Indicator */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
            <p className="text-black dark:text-white mt-2">Loading more collections...</p>
          </div>
        )}
        {/* End of Collections */}
        {visibleCollections >= filteredCollections.length && filteredCollections.length > 0 && (
          <div className="text-center py-8">
            <p className="text-neutral-500 dark:text-neutral-400">You&apos;ve reached the end of all collections</p>
          </div>
        )}
        {/* No results */}
        {filteredCollections.length === 0 && (
          <div className="text-center py-16">
            <p className="text-neutral-400 dark:text-neutral-500 text-lg">No collections found.</p>
          </div>
        )}
      </div>
      {/* Lightbox Modal */}
      {currentCollection && lightboxOpen && lightboxImages.length > 0 && (
        <Lightbox
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          photos={lightboxImages}
          currentIndex={currentPhotoIndex}
          onNavigate={navigateLightbox}
        />
      )}
    </div>
  );
}
