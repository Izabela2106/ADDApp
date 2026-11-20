import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Link from "next/link"

import { AppSidebar } from "@/components/app-sidebar"
import { Settings } from "@/components/settings"
import { SettingsProvider } from "@/components/settings-provider"
import { SiteNav } from "@/components/site-nav"
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
          <TodoListsProvider>
            <div className="flex min-h-full w-full flex-1">
              <AppSidebar />
              <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-sm">
                  <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3">
                    <div className="flex items-center gap-6">
                      <Link href="/" className="text-sm font-medium tracking-tight">
                        ADHD timer
                      </Link>
                      <SiteNav />
                    </div>
                    <Settings />
                  </div>
                </header>
                <main className="flex flex-1 flex-col">{children}</main>
              </div>
            </div>
          </TodoListsProvider>
        </SettingsProvider>
      </body>
    </html>
  )
}
