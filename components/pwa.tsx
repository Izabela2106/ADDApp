"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const DISMISS_KEY = "adhd-timer-install-dismissed"

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  )
}

export function Pwa() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [iosHint, setIosHint] = useState(false)

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (isStandalone()) return
    if (window.localStorage.getItem(DISMISS_KEY) === "1") return

    function onPrompt(event: Event) {
      event.preventDefault()
      setInstallEvent(event as BeforeInstallPromptEvent)
    }

    window.addEventListener("beforeinstallprompt", onPrompt)

    const ua = window.navigator.userAgent
    const ios = /iphone|ipad|ipod/i.test(ua)
    const safari = /safari/i.test(ua) && !/crios|fxios|edgios/i.test(ua)
    if (ios && safari) setIosHint(true)

    return () => window.removeEventListener("beforeinstallprompt", onPrompt)
  }, [])

  if (!installEvent && !iosHint) return null

  async function install() {
    if (!installEvent) return
    await installEvent.prompt()
    const choice = await installEvent.userChoice
    if (choice.outcome === "accepted") setInstallEvent(null)
  }

  function dismiss() {
    window.localStorage.setItem(DISMISS_KEY, "1")
    setInstallEvent(null)
    setIosHint(false)
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-foreground">
          {installEvent
            ? "Install ADHD timer to open it from your home screen, without the browser toolbar."
            : "To use this as an app, tap Share, then Add to Home Screen."}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          {installEvent ? (
            <Button type="button" onClick={install}>
              Install
            </Button>
          ) : null}
          <Button type="button" variant="ghost" onClick={dismiss}>
            Not now
          </Button>
        </div>
      </div>
    </div>
  )
}
