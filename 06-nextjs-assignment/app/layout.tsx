import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FavoritesProvider } from '@/components/FavoritesContext';

export const metadata: Metadata = {
  title: 'Project Explorer',
  description: 'A minimal project management portal built with Next.js App Router.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 antialiased selection:bg-zinc-800"
        suppressHydrationWarning
      >
        <FavoritesProvider>
          <Suspense fallback={<div className="h-14 border-b border-zinc-800 bg-zinc-950" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </FavoritesProvider>
      </body>
    </html>
  );
}
