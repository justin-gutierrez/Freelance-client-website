import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import SessionProviderWrapper from "./SessionProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Cynthia's Photography | Professional Portrait & Wedding Photography",
    template: "%s | Cynthia's Photography"
  },
  description: "Professional photography services specializing in portraits, weddings, maternity, and family sessions. Book your consultation today for stunning, timeless photographs.",
  keywords: [
    "photography",
    "portrait photography",
    "wedding photography", 
    "maternity photography",
    "family photography",
    "professional photographer",
    "photography sessions",
    "photography consultation",
    "photography portfolio"
  ],
  authors: [{ name: "Cynthia's Photography" }],
  creator: "Cynthia's Photography",
  publisher: "Cynthia's Photography",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cynthiasphotography.com'), // Replace with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cynthiasphotography.com', // Replace with your actual domain
    siteName: "Cynthia's Photography",
    title: "Cynthia's Photography | Professional Portrait & Wedding Photography",
    description: "Professional photography services specializing in portraits, weddings, maternity, and family sessions. Book your consultation today for stunning, timeless photographs.",
    images: [
      {
        url: '/images/og-image.jpg', // You'll need to add this image
        width: 1200,
        height: 630,
        alt: "Cynthia's Photography - Professional Portrait & Wedding Photography",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Cynthia's Photography | Professional Portrait & Wedding Photography",
    description: "Professional photography services specializing in portraits, weddings, maternity, and family sessions. Book your consultation today for stunning, timeless photographs.",
    images: ['/images/og-image.jpg'], // Same as Open Graph image
    creator: '@cynthiasphotography', // Replace with your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Replace with your Google Search Console verification code
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "PhotographyBusiness",
              "name": "Cynthia's Photography",
              "description": "Professional photography services specializing in portraits, weddings, maternity, and family sessions.",
              "url": "https://cynthiasphotography.com",
              "logo": "https://cynthiasphotography.com/images/logo.png",
              "image": "https://cynthiasphotography.com/images/og-image.jpg",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Your City",
                "addressRegion": "Your State",
                "addressCountry": "US"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-555-123-4567",
                "contactType": "customer service",
                "email": "hello@cynthiasphotography.com"
              },
              "sameAs": [
                "https://instagram.com/cynthiasphotography",
                "https://facebook.com/cynthiasphotography"
              ],
              "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": 40.7128,
                  "longitude": -74.0060
                },
                "geoRadius": "50000"
              },
              "priceRange": "$$",
              "openingHours": "Mo-Su 09:00-18:00"
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionProviderWrapper>
          <Navigation />
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
