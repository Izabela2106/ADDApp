"use client"

import type { ReactNode } from "react"

import { useCountdownTimer } from "@/lib/use-countdown-timer"
import { formatClock, formatRemaining, type TimerUnit } from "@/lib/timer"
import type { TimerSession } from "@/lib/timer-session"
import { Card, CardContent } from "@/components/ui/card"

export interface TimerProps {
  session: TimerSession
  onBack: () => void
}

const ARC_COLOR = "#e9a394"

function dialParts(totalSeconds: number, unit: TimerUnit) {
  if (unit === "seconds") {
    return [{ value: formatRemaining(totalSeconds, unit), label: "S" }]
  }

  const [minutes, seconds] = formatRemaining(totalSeconds, unit).split(":")
  return [
    { value: minutes, label: "M" },
    { value: seconds, label: "S" },
  ]
}

function progressArc(fraction: number) {
  const clamped = Math.min(Math.max(fraction, 0), 0.999)
  if (clamped < 0.004) {
    return null
  }

  const radius = 146
  const start = -Math.PI / 2
  const end = start + clamped * Math.PI * 2
  const x1 = 160 + radius * Math.cos(start)
  const y1 = 160 + radius * Math.sin(start)
  const x2 = 160 + radius * Math.cos(end)
  const y2 = 160 + radius * Math.sin(end)
  const largeArc = clamped > 0.5 ? 1 : 0

  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`
}

function PanelStat({
  label,
  value,
  liveLabel,
}: {
  label: string
  value: string
  liveLabel: string
}) {
  return (
    <div>
      <p className="text-[11px] leading-none font-light tracking-[0.16em] text-foreground/55">
        {label}
      </p>
      <p
        aria-live="polite"
        aria-label={liveLabel}
        className="mt-3 text-[1.85rem] leading-none font-extralight tracking-tight tabular-nums"
      >
        {value}
      </p>
    </div>
  )
}

function DialButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-11 items-center justify-center rounded-full border-[1.5px] border-current bg-transparent text-foreground transition-colors outline-none hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-foreground/25 disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  )
}

export function Timer({ session, onBack }: TimerProps) {
  const { unit } = session
  const {
    remaining,
    totalSeconds,
    paused,
    phase,
    progress,
    intervalCount,
    setPaused,
  } = useCountdownTimer(session)
  const parts = dialParts(remaining, unit)
  const remainingLabel = `${formatRemaining(remaining, unit)} remaining`
  const arc = progressArc(1 - progress)
  const elapsedPercent = Math.round((1 - progress) * 100)

  const panelClassName =
    "gap-0 rounded-sm bg-card shadow-[0_18px_50px_rgba(0,0,0,0.08)] ring-0"

  return (
    <div className="flex w-full max-w-3xl flex-col items-stretch gap-4 sm:flex-row sm:justify-center">
      <Card
        className={`${panelClassName} w-full justify-center px-7 py-8 sm:w-48 sm:shrink-0`}
      >
        <CardContent className="flex flex-col gap-8 px-0">
          <PanelStat
            label="ELAPSED"
            value={formatClock(totalSeconds)}
            liveLabel={formatClock(totalSeconds)}
          />
          <span className="h-px w-10 bg-current" aria-hidden="true" />
          <PanelStat
            label="INTERVALS"
            value={String(intervalCount)}
            liveLabel={`${intervalCount} intervals passed`}
          />
        </CardContent>
      </Card>
      <Card className={`relative w-full max-w-md py-8 ${panelClassName}`}>
      <CardContent className="flex flex-col items-center gap-4 pt-2 pb-1">
        <div className="relative aspect-square w-full max-w-[19rem] text-foreground">
          <svg
            viewBox="0 0 320 320"
            className="size-full overflow-visible"
            aria-hidden="true"
          >
            <circle
              cx="160"
              cy="160"
              r="122"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            {arc ? (
              <path
                d={arc}
                fill="none"
                stroke={ARC_COLOR}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="1.5 10"
              />
            ) : null}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="sr-only" aria-live="polite">
              {remainingLabel}
            </p>
            <div className="flex items-center" aria-hidden="true">
              {parts.map((part, index) => (
                <div key={part.label} className="flex items-center">
                  {index > 0 ? (
                    <span className="h-[4.6rem] w-px shrink-0 -translate-y-2 bg-current" />
                  ) : null}
                  <div className="flex min-w-16 flex-col items-center px-3">
                    <span className="text-[2.65rem] leading-none font-extralight tabular-nums tracking-tight">
                      {part.value}
                    </span>
                    <span className="mt-2.5 text-[11px] leading-none font-light tracking-[0.12em]">
                      {part.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          role="progressbar"
          aria-valuenow={elapsedPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Interval elapsed"
          className="sr-only"
        />
        <div className="-mt-2 flex w-full max-w-[17rem] items-center justify-between px-1">
          <DialButton
            label="Play"
            disabled={!paused || phase === "sound"}
            onClick={() => setPaused(false)}
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5 translate-x-px"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 7.2 16.6 12 9 16.8Z" />
            </svg>
          </DialButton>
          <DialButton
            label="Pause"
            disabled={paused || phase === "sound"}
            onClick={() => setPaused(true)}
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M9 7.5v9" />
              <path d="M15 7.5v9" />
            </svg>
          </DialButton>
          <DialButton label="Back" onClick={onBack}>
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <rect x="8" y="8" width="8" height="8" rx="0.6" />
            </svg>
          </DialButton>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
