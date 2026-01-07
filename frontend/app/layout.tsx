import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { headers } from "next/headers"
import ContextProvider from '@/context'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "NexoraSIM™ - AI-Driven eSIM & IoT Platform | Myanmar",
  description:
    "GSMA-compliant eSIM and IoT connectivity platform for Myanmar. Advanced AI-powered solutions with global reach, powered by Vercel infrastructure.",
  keywords: "eSIM, IoT, Myanmar, GSMA, AI, connectivity, telecommunications, Vercel, edge computing, SGP.22",
  authors: [{ name: "NexoraSIM" }],
  robots: "index, follow",
  openGraph: {
    title: "NexoraSIM™ - AI-Driven eSIM & IoT Platform",
    description: "GSMA-compliant eSIM and IoT connectivity platform for Myanmar",
    type: "website",
    locale: "en_US",
    siteName: "NexoraSIM",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexoraSIM™ - AI-Driven eSIM & IoT Platform",
    description: "GSMA-compliant eSIM and IoT connectivity platform for Myanmar",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
  manifest: "/manifest.json",
    generator: 'v0.app'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const cookies = headersList.get('cookie')

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="font-sans antialiased">
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  )
}
