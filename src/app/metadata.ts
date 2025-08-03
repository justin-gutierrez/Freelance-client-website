import { Metadata } from 'next';

export const homeMetadata: Metadata = {
  title: "Photography Portfolio | Professional Portrait & Wedding Collections",
  description: "Explore stunning photography collections featuring portraits, weddings, maternity sessions, and family photography. View our portfolio and book your session today.",
  keywords: [
    "photography portfolio",
    "portrait collections", 
    "wedding photography",
    "maternity photography",
    "family photography",
    "photography gallery",
    "professional photographer portfolio"
  ],
  openGraph: {
    title: "Photography Portfolio | Professional Portrait & Wedding Collections",
    description: "Explore stunning photography collections featuring portraits, weddings, maternity sessions, and family photography. View our portfolio and book your session today.",
    images: [
      {
        url: '/images/portfolio-og.jpg',
        width: 1200,
        height: 630,
        alt: "Photography Portfolio - Professional Portrait & Wedding Collections",
      },
    ],
  },
  twitter: {
    title: "Photography Portfolio | Professional Portrait & Wedding Collections",
    description: "Explore stunning photography collections featuring portraits, weddings, maternity sessions, and family photography. View our portfolio and book your session today.",
    images: ['/images/portfolio-og.jpg'],
  },
  alternates: {
    canonical: '/',
  },
};

export const bookingMetadata: Metadata = {
  title: "Book Photography Consultation | Schedule Your Session",
  description: "Book your photography consultation today. Choose from scheduled sessions on Wednesdays or submit a custom request. Professional portrait, wedding, and family photography services.",
  keywords: [
    "book photography session",
    "photography consultation",
    "schedule photography",
    "photography booking",
    "portrait photography booking",
    "wedding photography consultation",
    "family photography session"
  ],
  openGraph: {
    title: "Book Photography Consultation | Schedule Your Session",
    description: "Book your photography consultation today. Choose from scheduled sessions on Wednesdays or submit a custom request. Professional portrait, wedding, and family photography services.",
    images: [
      {
        url: '/images/booking-og.jpg',
        width: 1200,
        height: 630,
        alt: "Book Photography Consultation - Schedule Your Session",
      },
    ],
  },
  twitter: {
    title: "Book Photography Consultation | Schedule Your Session",
    description: "Book your photography consultation today. Choose from scheduled sessions on Wednesdays or submit a custom request. Professional portrait, wedding, and family photography services.",
    images: ['/images/booking-og.jpg'],
  },
  alternates: {
    canonical: '/booking',
  },
}; 