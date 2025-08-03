import { MetadataRoute } from 'next';
import { getVisibleCollections } from '@/lib/firestore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://cynthiasphotography.com'; // Replace with your actual domain

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/booking`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Dynamic collection pages
  let collectionPages: MetadataRoute.Sitemap = [];
  
  try {
    const collections = await getVisibleCollections();
    collectionPages = collections.map((collection) => ({
      url: `${baseUrl}/collection/${collection.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching collections for sitemap:', error);
  }

  return [...staticPages, ...collectionPages];
} 