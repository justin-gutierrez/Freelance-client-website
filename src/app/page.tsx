'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { collections, Collection } from '@/data/collections';
import Lightbox from '@/components/Lightbox';
// import Navigation from '@/components/Navigation';
import Fuse from 'fuse.js';
import { useSearchStore } from '@/lib/useSearchStore';

export default function HomePage() {
  const search = useSearchStore((state) => state.search);
  const [visibleCollections, setVisibleCollections] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Fuzzy search setup
  const fuse = useMemo(() => new Fuse(collections, {
    keys: ['title', 'description', 'tags', 'category', 'location'],
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 2,
  }), []);

  const filteredCollections = useMemo(() => {
    if (!search.trim()) return collections;
    return fuse.search(search).map(result => result.item);
  }, [search, fuse]);

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

  const openLightbox = (collection: Collection) => {
    setCurrentCollection(collection);
    setCurrentPhotoIndex(0);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentCollection(null);
  };

  const navigateLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
  };

  // Generate photos for the lightbox
  const getCollectionPhotos = (collection: Collection) => {
    // Define actual photo filenames for real collections
    const getPhotoFilenames = (collectionId: string): string[] => {
      switch (collectionId) {
        case 'justinsgradpics':
          return ['1.NP3Grad-67.jpg', '1.NP3Grad-71.jpg', '1.NP3Grad-80.jpg', '1.NP3Grad-81.jpg', '1.NP3Grad-82.jpg'];
        case 'amayasgradpics':
          return ['CYNR5054.jpg', 'CYNR5151.jpg', 'CYNR5500.jpg', 'CYNR5676.jpg'];
        default:
          // For other collections, generate placeholder filenames
          return Array.from({ length: Math.min(collection.photoCount, 10) }, (_, index) => `photo-${index + 1}.jpg`);
      }
    };

    const filenames = getPhotoFilenames(collection.id);
    return filenames.map((filename, index) => ({
      id: `${collection.id}-photo-${index + 1}`,
      title: `${collection.title} - Photo ${index + 1}`,
      description: `A beautiful photo from ${collection.title}`,
      imageUrl: `/images/${collection.id}/${filename}`,
      thumbnailUrl: `/images/${collection.id}/${filename}`,
    }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-16">
      {/* <Navigation /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredCollections.slice(0, visibleCollections).map((collection: Collection) => (
            <div key={collection.id} className="group break-inside-avoid">
              <div className="relative overflow-hidden rounded-lg bg-white dark:bg-black shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                {/* Collection Image */}
                <button
                  onClick={() => openLightbox(collection)}
                  className="w-full aspect-[3/4] bg-white dark:bg-black flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 relative overflow-hidden"
                  aria-label={`Preview ${collection.title} collection`}
                >
                  {(() => {
                    // Get the first photo filename for the collection
                    const getFirstPhotoFilename = (collectionId: string): string | null => {
                      switch (collectionId) {
                        case 'justinsgradpics':
                          return '1.NP3Grad-67.jpg';
                        case 'amayasgradpics':
                          return 'CYNR5054.jpg';
                        default:
                          return null; // Use placeholder for other collections
                      }
                    };

                    const firstPhoto = getFirstPhotoFilename(collection.id);
                    
                    if (firstPhoto) {
                      return (
                        <img
                          src={`/images/${collection.id}/${firstPhoto}`}
                          alt={collection.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="text-black dark:text-white text-center">
                                  <div class="text-4xl mb-2">📸</div>
                                  <p class="text-xs font-medium">${collection.photoCount} photos</p>
                                </div>
                              `;
                            }
                          }}
                        />
                      );
                    } else {
                      return (
                        <div className="text-black dark:text-white text-center">
                          <div className="text-4xl mb-2">📸</div>
                          <p className="text-xs font-medium">{collection.photoCount} photos</p>
                        </div>
                      );
                    }
                  })()}
                </button>
                {/* Only show the title below the image, small text */}
                <div className="p-3 text-center">
                  <h3 className="text-xs font-semibold dark:text-white truncate">
                    {collection.title}
                  </h3>
                </div>
                <div className="flex gap-2 mt-2 justify-center">
                  <button
                    onClick={() => openLightbox(collection)}
                    className="bg-white dark:bg-black dark:text-white border border-neutral-200 dark:border-neutral-800 px-3 py-1 rounded text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                  >
                    Preview
                  </button>
                  <Link
                    href={`/collection/${collection.id}`}
                    className="bg-transparent border border-white dark:border-neutral-800 dark:text-white px-3 py-1 rounded text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
                    View All
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
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
      {currentCollection && (
        <Lightbox
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          photos={getCollectionPhotos(currentCollection)}
          currentIndex={currentPhotoIndex}
          onNavigate={navigateLightbox}
        />
      )}
    </div>
  );
}
