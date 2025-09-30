import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BeachMate Busan',
  description: 'Find your perfect beach in Busan with personalized recommendations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}