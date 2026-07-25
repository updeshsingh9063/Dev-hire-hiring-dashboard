import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  weight: ['700', '900'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'DevHire — Full Stack Developer Hiring Portal',
  description: 'Apply for a Full Stack Developer role at our company.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans min-h-screen`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#111111',
              border: '2px solid #111111',
              borderRadius: 0,
              boxShadow: '4px 4px 0 0 rgba(0,0,0,0.7)',
              fontWeight: 700,
              fontSize: '0.8125rem',
            },
          }}
        />
      </body>
    </html>
  );
}
