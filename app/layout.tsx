import type { Metadata } from 'next'
import { Navigation } from '@/components/Navigation'
import { AudioUnlock } from '@/components/AudioUnlock'
import './globals.css'

export const metadata: Metadata = {
  title: 'PWA Inglés - Aprende Palabras',
  description: 'Una PWA para aprender vocabulario en inglés con tarjetas interactivas',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-slate-900">
        <AudioUnlock />
        <main className="pb-24">
          {children}
        </main>
        <Navigation />
      </body>
    </html>
  )
}
