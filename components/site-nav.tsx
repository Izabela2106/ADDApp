"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const tabs = [{ href: "/lists", label: "Lists" }]

export function SiteNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Primary" className="flex items-center">
      {tabs.map((tab) => {
        const active = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex h-9 items-center rounded-full px-3.5 text-sm font-light tracking-wide transition-colors outline-none focus-visible:ring-2 focus-visible:ring-foreground/25 ${
              active
                ? "bg-foreground/5 text-foreground"
                : "text-foreground/55 hover:bg-foreground/5 hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
