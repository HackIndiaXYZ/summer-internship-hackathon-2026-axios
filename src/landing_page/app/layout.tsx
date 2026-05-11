import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: 'Vigilix AI - Trust Infrastructure for AI-Assisted Development',
  description: 'Determine whether your AI-generated code is trustworthy, secure, and ready to deploy. Detect hallucinations, expose insecure shortcuts, and ship with confidence.',
  generator: 'v0.app',
  keywords: ['AI security', 'code analysis', 'AI-generated code', 'security scanning', 'trust verification'],
  authors: [{ name: 'Vigilix AI' }],
  openGraph: {
    title: 'Vigilix AI - Trust Infrastructure for AI-Assisted Development',
    description: 'Secure your AI-generated code. Detect hallucinations, expose insecure shortcuts, and ship with confidence.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vigilix AI',
    description: 'Trust infrastructure for AI-assisted development.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0d1117',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
