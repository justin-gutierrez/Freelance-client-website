export interface Collection {
  id: string;
  title: string;
  description: string;
  photoCount: number;
  tags: string[];
  category: 'portrait' | 'wedding' | 'event' | 'commercial' | 'family' | 'engagement' | 'landscape' | 'street' | 'nature' | 'architecture';
  location?: string;
  date: string;
  featured: boolean;
  coverImage?: string;
}

export const collections: Collection[] = [
  {
    id: 'justinsgradpics',
    title: "Justin's Graduation Photos",
    description: "Professional graduation portraits capturing this special milestone with elegance and style.",
    photoCount: 5,
    tags: ['graduation', 'portrait', 'professional', 'milestone', 'celebration', 'academic'],
    category: 'portrait',
    date: '2024-01-20',
    featured: true
  },
  {
    id: 'amayasgradpics',
    title: "Amaya's Graduation Photos",
    description: "Beautiful graduation session highlighting this important achievement with natural beauty and grace.",
    photoCount: 4,
    tags: ['graduation', 'portrait', 'professional', 'milestone', 'celebration', 'academic'],
    category: 'portrait',
    date: '2024-01-18',
    featured: true
  },
  {
    id: 'portraits-2024',
    title: 'Portrait Collection 2024',
    description: "Professional headshots and creative portraits capturing individual personalities.",
    photoCount: 45,
    tags: ['portrait', 'headshot', 'professional', 'studio', 'lighting', 'creative'],
    category: 'portrait',
    date: '2024-01-15',
    featured: true
  },
  {
    id: 'wedding-sarah-mike',
    title: 'Sarah & Mike Wedding',
    description: "Beautiful wedding ceremony and reception captured in natural light.",
    photoCount: 320,
    tags: ['wedding', 'ceremony', 'reception', 'romantic', 'outdoor', 'natural light'],
    category: 'wedding',
    location: 'Central Park, NYC',
    date: '2024-01-10',
    featured: true
  },
  {
    id: 'family-park-session',
    title: 'Family Park Session',
    description: "Heartwarming family portraits in the golden hour light.",
    photoCount: 28,
    tags: ['family', 'outdoor', 'golden hour', 'natural', 'candid', 'children'],
    category: 'family',
    location: 'Prospect Park, Brooklyn',
    date: '2024-01-08',
    featured: false
  },
  {
    id: 'corporate-event-2024',
    title: 'Corporate Event 2024',
    description: "Professional event photography for annual company gathering.",
    photoCount: 156,
    tags: ['corporate', 'event', 'business', 'professional', 'networking', 'conference'],
    category: 'event',
    location: 'Manhattan Conference Center',
    date: '2024-01-05',
    featured: false
  },
  {
    id: 'product-photography',
    title: 'Product Photography',
    description: "Clean and professional product photography for e-commerce.",
    photoCount: 89,
    tags: ['commercial', 'product', 'clean', 'minimal', 'studio', 'lighting'],
    category: 'commercial',
    date: '2024-01-03',
    featured: false
  },
  {
    id: 'engagement-city',
    title: 'City Engagement Session',
    description: "Romantic engagement photos against urban backdrop.",
    photoCount: 42,
    tags: ['engagement', 'romantic', 'urban', 'city', 'architecture', 'street'],
    category: 'engagement',
    location: 'Downtown Manhattan',
    date: '2024-01-01',
    featured: true
  },
  {
    id: 'landscape-mountains',
    title: 'Mountain Landscapes',
    description: "Breathtaking mountain landscapes captured at sunrise.",
    photoCount: 67,
    tags: ['landscape', 'mountains', 'nature', 'sunrise', 'outdoor', 'scenic'],
    category: 'landscape',
    location: 'Rocky Mountains',
    date: '2023-12-28',
    featured: true
  },
  {
    id: 'street-photography',
    title: 'Street Photography',
    description: "Candid moments of city life and urban culture.",
    photoCount: 134,
    tags: ['street', 'urban', 'candid', 'city life', 'culture', 'black and white'],
    category: 'street',
    location: 'Various NYC Locations',
    date: '2023-12-25',
    featured: false
  },
  {
    id: 'nature-macro',
    title: 'Nature Macro',
    description: "Intimate close-ups of nature&apos;s smallest details.",
    photoCount: 78,
    tags: ['nature', 'macro', 'close-up', 'flowers', 'insects', 'details'],
    category: 'nature',
    date: '2023-12-20',
    featured: false
  },
  {
    id: 'architecture-modern',
    title: 'Modern Architecture',
    description: "Contemporary architectural photography highlighting design.",
    photoCount: 56,
    tags: ['architecture', 'modern', 'design', 'geometric', 'urban', 'contemporary'],
    category: 'architecture',
    location: 'Various Cities',
    date: '2023-12-15',
    featured: false
  },
  {
    id: 'portraits-artistic',
    title: 'Artistic Portraits',
    description: "Creative and artistic portrait photography with unique concepts.",
    photoCount: 34,
    tags: ['portrait', 'artistic', 'creative', 'conceptual', 'studio', 'experimental'],
    category: 'portrait',
    date: '2023-12-10',
    featured: true
  },
  {
    id: 'wedding-intimate',
    title: 'Intimate Wedding',
    description: "Small, intimate wedding celebration with close family and friends.",
    photoCount: 89,
    tags: ['wedding', 'intimate', 'small', 'family', 'romantic', 'cozy'],
    category: 'wedding',
    location: 'Private Garden, Upstate NY',
    date: '2023-12-05',
    featured: false
  },
  {
    id: 'family-holiday',
    title: 'Holiday Family Session',
    description: "Festive family portraits during the holiday season.",
    photoCount: 23,
    tags: ['family', 'holiday', 'festive', 'winter', 'cozy', 'celebration'],
    category: 'family',
    date: '2023-12-01',
    featured: false
  },
  {
    id: 'event-fashion',
    title: 'Fashion Event',
    description: "High-end fashion event photography and runway coverage.",
    photoCount: 203,
    tags: ['event', 'fashion', 'runway', 'style', 'luxury', 'designer'],
    category: 'event',
    location: 'Fashion Week, NYC',
    date: '2023-11-28',
    featured: true
  },
  {
    id: 'commercial-food',
    title: 'Food Photography',
    description: "Appetizing food photography for restaurants and culinary brands.",
    photoCount: 67,
    tags: ['commercial', 'food', 'culinary', 'appetizing', 'restaurant', 'gastronomy'],
    category: 'commercial',
    date: '2023-11-25',
    featured: false
  },
  {
    id: 'engagement-nature',
    title: 'Nature Engagement',
    description: "Romantic engagement session in natural outdoor settings.",
    photoCount: 38,
    tags: ['engagement', 'nature', 'outdoor', 'romantic', 'natural light', 'scenic'],
    category: 'engagement',
    location: 'Hudson Valley',
    date: '2023-11-20',
    featured: false
  },
  {
    id: 'landscape-coastal',
    title: 'Coastal Landscapes',
    description: "Stunning coastal and ocean landscape photography.",
    photoCount: 92,
    tags: ['landscape', 'coastal', 'ocean', 'beach', 'waves', 'seascape'],
    category: 'landscape',
    location: 'Maine Coast',
    date: '2023-11-15',
    featured: false
  },
  {
    id: 'street-night',
    title: 'Night Street Photography',
    description: "Vibrant night street photography with city lights.",
    photoCount: 45,
    tags: ['street', 'night', 'city lights', 'urban', 'neon', 'atmospheric'],
    category: 'street',
    location: 'Times Square, NYC',
    date: '2023-11-10',
    featured: false
  },
  {
    id: 'nature-wildlife',
    title: 'Wildlife Photography',
    description: "Capturing wildlife in their natural habitats.",
    photoCount: 156,
    tags: ['nature', 'wildlife', 'animals', 'outdoor', 'habitat', 'conservation'],
    category: 'nature',
    location: 'Yellowstone National Park',
    date: '2023-11-05',
    featured: true
  },
  {
    id: 'architecture-historic',
    title: 'Historic Architecture',
    description: "Classic and historic architectural photography.",
    photoCount: 73,
    tags: ['architecture', 'historic', 'classic', 'heritage', 'timeless', 'elegant'],
    category: 'architecture',
    location: 'Various Historic Sites',
    date: '2023-11-01',
    featured: false
  }
];

export const getCollectionById = (id: string): Collection | undefined => {
  return collections.find(collection => collection.id === id);
};

export const getCollectionsByCategory = (category: Collection['category']): Collection[] => {
  return collections.filter(collection => collection.category === category);
};

export const getFeaturedCollections = (): Collection[] => {
  return collections.filter(collection => collection.featured);
};

export const searchCollections = (query: string): Collection[] => {
  const lowercaseQuery = query.toLowerCase();
  return collections.filter(collection => 
    collection.title.toLowerCase().includes(lowercaseQuery) ||
    collection.description.toLowerCase().includes(lowercaseQuery) ||
    collection.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    (collection.location && collection.location.toLowerCase().includes(lowercaseQuery))
  );
}; 