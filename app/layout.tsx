import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '2D Space Shooter',
  description: 'A 2D space shooter game built with Next.js and Tailwind CSS',
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

