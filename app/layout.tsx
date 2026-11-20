import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

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
  title: "ADHD timer",
  description:
    "A motivational timer for people with ADHD — fixed or random back-to-back intervals with a short alarm between each one.",
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
      </body>
    </html>
  )
}
