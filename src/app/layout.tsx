import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Professional Photography | Capturing Life's Beautiful Moments",
  description: "Professional photography services for portraits, weddings, events, and commercial projects. Book your session today.",
  keywords: "photography, portraits, weddings, events, professional photographer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'light';
                const html = document.documentElement;
                html.classList.remove('dark', 'light');
                html.classList.add(theme);
                html.style.colorScheme = theme;
                document.body.style.backgroundColor = theme === 'dark' ? '#000000' : '#ffffff';
                document.body.style.color = theme === 'dark' ? '#ededed' : '#171717';
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
