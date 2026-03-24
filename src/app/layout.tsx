import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import { Providers } from '@/components/Providers'
import './globals.css'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'CampusCare | Complaint Management',
  description: 'Digital complaint management portal for campus facilities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={outfit.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
