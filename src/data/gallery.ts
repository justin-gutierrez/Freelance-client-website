export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  category: 'portrait' | 'wedding' | 'event' | 'commercial' | 'family' | 'engagement';
  imageUrl: string;
  thumbnailUrl: string;
  date: string;
  tags: string[];
}

export const galleryImages: GalleryImage[] = [
  {
    id: '1',
    title: 'Elegant Portrait',
    description: 'A stunning portrait session capturing natural beauty and confidence.',
    category: 'portrait',
    imageUrl: '/images/portrait-1.jpg',
    thumbnailUrl: '/images/portrait-1-thumb.jpg',
    date: '2024-01-15',
    tags: ['portrait', 'professional', 'headshot']
  },
  {
    id: '2',
    title: 'Wedding Ceremony',
    description: 'Beautiful wedding ceremony captured in natural light.',
    category: 'wedding',
    imageUrl: '/images/wedding-1.jpg',
    thumbnailUrl: '/images/wedding-1-thumb.jpg',
    date: '2024-01-10',
    tags: ['wedding', 'ceremony', 'romantic']
  },
  {
    id: '3',
    title: 'Family Session',
    description: 'Heartwarming family portraits in the park.',
    category: 'family',
    imageUrl: '/images/family-1.jpg',
    thumbnailUrl: '/images/family-1-thumb.jpg',
    date: '2024-01-08',
    tags: ['family', 'outdoor', 'natural']
  },
  {
    id: '4',
    title: 'Corporate Event',
    description: 'Professional event photography for corporate functions.',
    category: 'event',
    imageUrl: '/images/event-1.jpg',
    thumbnailUrl: '/images/event-1-thumb.jpg',
    date: '2024-01-05',
    tags: ['corporate', 'event', 'professional']
  },
  {
    id: '5',
    title: 'Product Photography',
    description: 'Clean and professional product photography.',
    category: 'commercial',
    imageUrl: '/images/commercial-1.jpg',
    thumbnailUrl: '/images/commercial-1-thumb.jpg',
    date: '2024-01-03',
    tags: ['commercial', 'product', 'clean']
  },
  {
    id: '6',
    title: 'Engagement Session',
    description: 'Romantic engagement photos in the city.',
    category: 'engagement',
    imageUrl: '/images/engagement-1.jpg',
    thumbnailUrl: '/images/engagement-1-thumb.jpg',
    date: '2024-01-01',
    tags: ['engagement', 'romantic', 'urban']
  }
];

export const getImagesByCategory = (category: GalleryImage['category']) => {
  return galleryImages.filter(image => image.category === category);
};

export const getImageById = (id: string) => {
  return galleryImages.find(image => image.id === id);
}; 