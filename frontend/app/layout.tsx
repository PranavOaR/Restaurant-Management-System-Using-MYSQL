import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Restaurant Management System',
  description: 'Order food online from our restaurant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Playfair+Display:wght@600;700;800;900&family=Montserrat:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}
