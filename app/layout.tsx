import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { Pwa } from "@/components/pwa"
import { SettingsProvider } from "@/components/settings-provider"
import { TodoListsProvider } from "@/components/todo-lists-provider"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  applicationName: "ADHD timer",
  title: "ADHD timer",
  description:
    "A motivational timer for people with ADHD — fixed or random back-to-back intervals with a short alarm between each one.",
  appleWebApp: {
    capable: true,
    title: "ADHD timer",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
}

export const viewport: Viewport = {
  themeColor: "#171717",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="default"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SettingsProvider>
          <TodoListsProvider>{children}</TodoListsProvider>
        </SettingsProvider>
        <Pwa />
      </body>
    </html>
  )
}
