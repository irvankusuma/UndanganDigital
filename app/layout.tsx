import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'Undangan Pernikahan Ahmad & Siti',
    template: '%s | Ahmad & Siti',
  },
  description: 'Kami mengundang Anda untuk merayakan hari istimewa kami. Bergabunglah dalam pernikahan Ahmad & Siti.',
  keywords: ['undangan digital', 'undangan pernikahan', 'undangan online', 'wedding invitation', 'digital invitation'],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://eternalinvite.com',
    siteName: 'EternalInvite',
    title: 'Undangan Pernikahan Ahmad & Siti',
    description: 'Kami mengundang Anda untuk merayakan hari istimewa kami. Bergabunglah dalam pernikahan Ahmad & Siti.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#fff',
              color: '#1a1a1a',
              borderRadius: '10px',
              border: '1px solid #E8D5B0',
              boxShadow: '0 4px 24px rgba(201,169,110,0.15)',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#E8627A',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
