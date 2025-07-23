import React, { useEffect, useState } from 'react';
import { getCollectionBySlug, Collection, CollectionImage } from '@/lib/firestore';
import { useParams } from 'next/navigation';

export default function GalleryCollectionPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : '';
  const [collection, setCollection] = useState<Collection | null>(null);
  const [images, setImages] = useState<CollectionImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    getCollectionBySlug(slug)
      .then(({ collection, images }) => {
        setCollection(collection);
        setImages(images);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load collection. Please try again later.');
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mb-4"></div>
        <p className="text-black dark:text-white">Loading collection...</p>
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

  if (!collection) {
    return <div className="text-center py-16">Collection not found.</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{collection.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">{collection.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-900">
              <img
                src={img.imageUrl}
                alt={img.title}
                className="w-full h-64 object-cover object-center transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <h2 className="text-white text-sm font-semibold truncate">{img.title}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 