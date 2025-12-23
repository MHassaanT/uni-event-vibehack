import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UniEvent - Smart Campus Event Discovery',
  description: 'Discover campus events with AI-powered recommendations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}