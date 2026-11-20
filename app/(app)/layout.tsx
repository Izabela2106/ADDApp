import Link from "next/link"

import { AppSidebar } from "@/components/app-sidebar"
import { Settings } from "@/components/settings"
import { SiteNav } from "@/components/site-nav"
import { UserMenu } from "@/components/user-menu"
import { verifySession } from "@/lib/session"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await verifySession()

  return (
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
            <div className="flex items-center gap-3">
              <UserMenu name={session.user.name} />
              <Settings />
            </div>
          </div>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </div>
  )
}
