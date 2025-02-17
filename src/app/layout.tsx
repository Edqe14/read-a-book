import './globals.css';

import type { Metadata } from 'next';
import { Inter, Noto_Serif } from 'next/font/google';
import { HeroUIProvider } from '@heroui/react';
import { cn } from '@/utils/cn';

const inter = Inter({ subsets: ['latin'], variable: '--inter' });
const notoSerif = Noto_Serif({ subsets: ['latin'], variable: '--noto-serif' });

export const metadata: Metadata = {
  title: 'read-a-book',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, notoSerif.variable)}>
        <HeroUIProvider className="min-h-screen flex flex-col w-full">
          {children}
        </HeroUIProvider>
      </body>
    </html>
  );
}
