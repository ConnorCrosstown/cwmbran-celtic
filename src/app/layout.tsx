import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Cwmbran Celtic AFC | Official Website',
    template: '%s | Cwmbran Celtic AFC',
  },
  description: 'Official website of Cwmbran Celtic AFC. Get the latest fixtures, results, news and information about Welsh football in Torfaen.',
  keywords: ['Cwmbran Celtic', 'Welsh football', 'JD Cymru South', 'Genero Adran South', 'Torfaen', 'football club', 'Cwmbran', 'Wales'],
  authors: [{ name: 'Cwmbran Celtic AFC' }],
  metadataBase: new URL('https://cwmbranceltic.com'),
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Cwmbran Celtic AFC',
    title: 'Cwmbran Celtic AFC | Official Website',
    description: 'Official website of Cwmbran Celtic AFC. Get the latest fixtures, results, news and information about Welsh football in Torfaen.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cwmbran Celtic AFC',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cwmbran Celtic AFC | Official Website',
    description: 'Official website of Cwmbran Celtic AFC. Get the latest fixtures, results, news and information.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
        <ThemeProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
