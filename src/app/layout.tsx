import './globals.css';

import type { Metadata, Viewport } from 'next';
import { Noto_Serif } from 'next/font/google';
import { cn } from '@/utils/cn';
import { BaseProviders } from './providers';
import { rose } from '../../tailwind.config';

const notoSerif = Noto_Serif({ subsets: ['latin'], variable: '--noto-serif' });

export const viewport: Viewport = {
  themeColor: rose.DEFAULT,
};

export const metadata: Metadata = {
  title: 'Read A Book - Your Online Reading Platform',
  description:
    'Discover and enjoy books online with our easy-to-use reading platform. Access a vast library of titles across various genres.',
  keywords: ['books', 'reading', 'online library', 'ebooks', 'literature'],
  authors: [{ name: 'Read A Book Team' }],
  openGraph: {
    title: 'Read-a-Book',
    description: 'Your comprehensive online reading platform',
    url: 'https://read-a-book.my.id',
    siteName: 'Read A Book',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Read A Book',
    description: 'Your comprehensive online reading platform',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={cn(notoSerif.variable)}>
        <BaseProviders>{children}</BaseProviders>
      </body>
    </html>
  );
}
