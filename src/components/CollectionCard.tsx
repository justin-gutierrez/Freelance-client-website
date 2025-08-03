import React from 'react';
import Link from 'next/link';
import OptimizedImage from './OptimizedImage';

export interface Collection {
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

interface CollectionCardProps {
  collection: Collection;
  onPreview: (collection: Collection) => void;
  onViewAll?: (collection: Collection) => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onPreview, onViewAll }) => {
  const photoCount = collection.images?.length || 0;

  return (
    <div className="group break-inside-avoid">
      <div className="relative overflow-hidden rounded-lg bg-white dark:bg-black shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
        {/* Collection Image */}
        <button
          onClick={() => onPreview(collection)}
          className="w-full aspect-[3/4] bg-white dark:bg-black flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 relative overflow-hidden"
          aria-label={`Preview ${collection.name} collection`}
        >
          {collection.coverImageUrl ? (
            <OptimizedImage
              src={collection.coverImageUrl}
              alt={collection.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="text-black dark:text-white text-center">
              <div className="text-4xl mb-2">📸</div>
              <p className="text-xs font-medium">{photoCount} photos</p>
            </div>
          )}
        </button>
        {/* Only show the title below the image, small text */}
        <div className="p-3 text-center">
          <h3 className="text-xs font-semibold dark:text-white truncate">
            {collection.name}
          </h3>
          {collection.tags && collection.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mt-2">
              {collection.tags.slice(0, 5).map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 text-[10px] rounded-full"
                >
                  {tag}
                </span>
              ))}
              {collection.tags.length > 5 && (
                <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 text-[10px] rounded-full">
                  +{collection.tags.length - 5}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-2 justify-center">
          <button
            onClick={() => onPreview(collection)}
            className="bg-white dark:bg-black dark:text-white border border-neutral-200 dark:border-neutral-800 px-3 py-1 rounded text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            Preview
          </button>
          <Link
            href={`/collection/${collection.slug}`}
            className="bg-transparent border border-white dark:border-neutral-800 dark:text-white px-3 py-1 rounded text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            View All
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard; 