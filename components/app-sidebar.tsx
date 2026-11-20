"use client"

import { useState } from "react"

import { SidebarLists } from "@/components/sidebar-lists"

export function AppSidebar() {
  const [open, setOpen] = useState(true)

  return (
    <aside
      aria-label="Sidebar"
      className={`sticky top-0 flex h-dvh shrink-0 flex-col bg-card text-foreground shadow-[0_18px_50px_rgba(0,0,0,0.08)] transition-[width] duration-200 ${
        open ? "w-72" : "w-[4.75rem]"
      }`}
    >
      <div
        className={`flex shrink-0 pt-4 ${open ? "justify-end px-4" : "justify-center"}`}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          title={open ? "Collapse sidebar" : "Expand sidebar"}
          onClick={() => setOpen((current) => !current)}
          className="inline-flex size-11 items-center justify-center rounded-full border-[1.5px] border-current bg-transparent text-foreground transition-colors outline-none hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-foreground/25"
        >
          <svg
            viewBox="0 0 24 24"
            className={`size-5 ${open ? "" : "rotate-180"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14.5 6.5 9 12l5.5 5.5" />
          </svg>
        </button>
      </div>
      {open ? <SidebarLists /> : null}
    </aside>
  )
}
