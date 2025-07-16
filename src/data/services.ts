export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  includes: string[];
  icon: string;
  category: 'portrait' | 'wedding' | 'event' | 'commercial' | 'family' | 'engagement';
}

export const services: Service[] = [
  {
    id: '1',
    title: 'Portrait Session',
    description: 'Professional headshots and creative portraits for individuals.',
    price: 'Starting at $150',
    duration: '1-2 hours',
    includes: [
      'Professional photography session',
      '10 edited digital images',
      'Online gallery',
      'Print release',
      'Basic retouching'
    ],
    icon: '👤',
    category: 'portrait'
  },
  {
    id: '2',
    title: 'Wedding Photography',
    description: 'Complete wedding coverage from preparation to reception.',
    price: 'Starting at $2,500',
    duration: 'Full day',
    includes: [
      'Full day coverage',
      'Engagement session',
      '200+ edited digital images',
      'Online gallery',
      'Print release',
      'Wedding album',
      'USB with all images'
    ],
    icon: '💒',
    category: 'wedding'
  },
  {
    id: '3',
    title: 'Event Photography',
    description: 'Professional coverage for corporate events and special occasions.',
    price: 'Starting at $300',
    duration: '2-4 hours',
    includes: [
      'Event coverage',
      '50+ edited digital images',
      'Online gallery',
      'Print release',
      'Quick turnaround'
    ],
    icon: '🎉',
    category: 'event'
  },
  {
    id: '4',
    title: 'Commercial Photography',
    description: 'Product photography and business branding images.',
    price: 'Starting at $200',
    duration: '2-3 hours',
    includes: [
      'Product photography',
      '20 edited digital images',
      'Multiple angles',
      'Online gallery',
      'Commercial usage rights'
    ],
    icon: '🏢',
    category: 'commercial'
  },
  {
    id: '5',
    title: 'Family Session',
    description: 'Beautiful family portraits in natural settings.',
    price: 'Starting at $200',
    duration: '1-2 hours',
    includes: [
      'Family photography session',
      '15 edited digital images',
      'Online gallery',
      'Print release',
      'Location suggestions'
    ],
    icon: '👨‍👩‍👧‍👦',
    category: 'family'
  },
  {
    id: '6',
    title: 'Engagement Session',
    description: 'Romantic engagement photos to celebrate your love story.',
    price: 'Starting at $250',
    duration: '1-2 hours',
    includes: [
      'Engagement photography session',
      '20 edited digital images',
      'Online gallery',
      'Print release',
      'Location suggestions',
      'Save the date designs'
    ],
    icon: '💍',
    category: 'engagement'
  }
];

export const getServicesByCategory = (category: Service['category']) => {
  return services.filter(service => service.category === category);
};

export const getServiceById = (id: string) => {
  return services.find(service => service.id === id);
}; 