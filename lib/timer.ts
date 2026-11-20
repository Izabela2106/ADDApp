export type TimerUnit = "seconds" | "minutes"
export type TimerMode = "range" | "fixed"

interface TimerRange {
  min: number
  max: number
  unit: TimerUnit
}

function randomInclusiveInt(min: number, max: number): number {
  const lo = Math.min(min, max)
  const hi = Math.max(min, max)
  return Math.floor(Math.random() * (hi - lo + 1)) + lo
}

function toSeconds(amount: number, unit: TimerUnit): number {
  const value = Math.max(1, amount)
  return unit === "minutes" ? value * 60 : value
}

function randomDurationSeconds(range: TimerRange): number {
  const amount = Math.max(1, randomInclusiveInt(range.min, range.max))
  return toSeconds(amount, range.unit)
}

export function nextDurationSeconds(
  mode: TimerMode,
  range: TimerRange
): number {
  if (mode === "fixed") {
    return toSeconds(range.min, range.unit)
  }

  return randomDurationSeconds(range)
}

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60

  return [hours, minutes, seconds]
    .map((part) => part.toString().padStart(2, "0"))
    .join(":")
}

export function formatRemaining(totalSeconds: number, unit: TimerUnit): string {
  if (unit === "seconds") {
    return String(totalSeconds)
  }

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}
