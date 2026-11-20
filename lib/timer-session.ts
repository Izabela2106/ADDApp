import { ALARM_SOUND_DURATION_MS } from "@/lib/alarm-sounds"
import {
  nextDurationSeconds,
  type TimerMode,
  type TimerUnit,
} from "@/lib/timer"

const STORAGE_KEY = "adhd-timer.session"

export interface TimerSession {
  mode: TimerMode
  min: number
  max: number
  unit: TimerUnit
  duration: number
  remaining: number
  paused: boolean
  phase: "running" | "sound"
  completedSeconds: number
  intervalCount: number
  /** Wall-clock time when `remaining` was last exact. */
  updatedAt: number
}

function isWholeNumber(value: unknown, min: number): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= min
}

function isTimerSession(value: unknown): value is TimerSession {
  if (!value || typeof value !== "object") return false
  const session = value as TimerSession
  return (
    (session.mode === "range" || session.mode === "fixed") &&
    (session.unit === "seconds" || session.unit === "minutes") &&
    (session.phase === "running" || session.phase === "sound") &&
    typeof session.paused === "boolean" &&
    isWholeNumber(session.min, 1) &&
    isWholeNumber(session.max, 1) &&
    isWholeNumber(session.duration, 1) &&
    isWholeNumber(session.remaining, 0) &&
    session.remaining <= session.duration &&
    isWholeNumber(session.completedSeconds, 0) &&
    isWholeNumber(session.intervalCount, 0) &&
    isWholeNumber(session.updatedAt, 0)
  )
}

export function secondsLeft(
  session: Pick<TimerSession, "remaining" | "updatedAt" | "paused">,
  now: number
): number {
  if (session.paused) return session.remaining
  const elapsed = Math.max(0, Math.floor((now - session.updatedAt) / 1000))
  return Math.max(0, session.remaining - elapsed)
}

function beginNextInterval(session: TimerSession, now: number): TimerSession {
  const duration = nextDurationSeconds(session.mode, {
    min: session.min,
    max: session.max,
    unit: session.unit,
  })

  return {
    ...session,
    duration,
    remaining: duration,
    paused: false,
    phase: "running",
    updatedAt: now,
  }
}

/** Apply time that passed while the tab was closed. */
export function resolveTimerSession(
  session: TimerSession,
  now: number
): TimerSession {
  if (session.paused) return session

  if (session.phase === "sound") {
    if (now - session.updatedAt < ALARM_SOUND_DURATION_MS) return session
    return beginNextInterval(session, now)
  }

  const left = secondsLeft(session, now)
  if (left > 0) {
    return { ...session, remaining: left, updatedAt: now }
  }

  return beginNextInterval(
    {
      ...session,
      completedSeconds: session.completedSeconds + session.duration,
      intervalCount: session.intervalCount + 1,
    },
    now
  )
}

export function createTimerSession(config: {
  mode: TimerMode
  min: number
  max: number
  unit: TimerUnit
}): TimerSession {
  const min = Math.max(1, Math.floor(config.min))
  const max = Math.max(1, Math.floor(config.max))
  const duration = nextDurationSeconds(config.mode, {
    min,
    max,
    unit: config.unit,
  })
  return {
    mode: config.mode,
    min,
    max,
    unit: config.unit,
    duration,
    remaining: duration,
    paused: false,
    phase: "running",
    completedSeconds: 0,
    intervalCount: 0,
    updatedAt: Date.now(),
  }
}

export function readTimerSession(): TimerSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!isTimerSession(parsed)) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    const resolved = resolveTimerSession(parsed, Date.now())
    if (resolved !== parsed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resolved))
    }
    return resolved
  } catch {
    return null
  }
}

export function writeTimerSession(session: TimerSession) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {
    // Ignore private-mode and quota failures so the timer still runs.
  }
}

export function clearTimerSession() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore private-mode and quota failures so leaving the timer still works.
  }
}
