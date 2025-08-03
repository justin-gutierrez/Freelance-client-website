import { Metadata } from 'next';
import { getCollectionBySlug } from '@/lib/firestore';

interface CollectionLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: CollectionLayoutProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { collection } = await getCollectionBySlug(resolvedParams.id);
  
  if (!collection) {
    return {
      title: "Collection Not Found",
      description: "The requested photography collection could not be found.",
    };
  }

  const title = `${collection.name} | Photography Collection`;
  const description = collection.description || `View the ${collection.name} photography collection featuring stunning portraits, weddings, and special moments.`;
  const keywords = [
    collection.name.toLowerCase(),
    "photography collection",
    "portrait photography",
    "wedding photography",
    "professional photography",
    ...(collection.tags || [])
  ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: [
        {
          url: collection.coverImageUrl || '/images/default-collection-og.jpg',
          width: 1200,
          height: 630,
          alt: `${collection.name} - Photography Collection`,
        },
      ],
      type: 'article',
    },
    twitter: {
      title,
      description,
      images: [collection.coverImageUrl || '/images/default-collection-og.jpg'],
      card: 'summary_large_image',
    },
    alternates: {
      canonical: `/collection/${collection.slug}`,
    },
  };
}

export default function CollectionLayout({ children }: CollectionLayoutProps) {
  return (
    <>
      {/* Structured data for the collection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "Photography Collection",
            "description": "Professional photography collection featuring portraits, weddings, and special moments.",
            "url": "https://cynthiasphotography.com/collection",
            "creator": {
              "@type": "Person",
              "name": "Cynthia's Photography"
            },
            "datePublished": new Date().toISOString(),
          })
        }}
      />
      {children}
    </>
  );
} 