import React from 'react';
import CollectionCard, { Collection } from './CollectionCard';

interface CollectionGridProps {
  collections: Collection[];
  onPreview: (collection: Collection) => Promise<void>;
}

const CollectionGrid: React.FC<CollectionGridProps> = ({ collections, onPreview }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} onPreview={onPreview} />
      ))}
    </div>
  );
};

export default CollectionGrid; 