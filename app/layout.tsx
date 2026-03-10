import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ subsets: ['latin'] });
const geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Flutterwave Payment | Secure Checkout',
  description:
    'Secure payment processing powered by Flutterwave. Process payments safely and efficiently.',
  keywords: [
    'payment',
    'flutterwave',
    'checkout',
    'secure',
    'credit card',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1a1a1a',
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="scroll-smooth"
      style={{
        fontFamily: `${geistSans.style.fontFamily}`,
      }}
    >
      <body className="bg-background text-foreground antialiased">
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95">
          {children}
        </div>
      </body>
    </html>
  );
}
