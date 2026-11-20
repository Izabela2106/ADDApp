"use client"

import { useEffect, useState, type FormEvent, type ReactNode } from "react"

import { Timer } from "@/components/timer"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { TimerMode, TimerUnit } from "@/lib/timer"
import {
  clearTimerSession,
  createTimerSession,
  readTimerSession,
  writeTimerSession,
  type TimerSession,
} from "@/lib/timer-session"

const numberInputClass =
  "h-auto rounded-none border-0 border-b-[1.5px] border-foreground/25 bg-transparent px-0 text-center text-[2.65rem] font-extralight tabular-nums shadow-none [appearance:textfield] focus-visible:border-foreground focus-visible:ring-0 md:text-[2.65rem] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"

const captionClass =
  "text-[11px] font-light tracking-[0.16em] text-foreground/55"

function Choice({
  id,
  value,
  children,
}: {
  id: string
  value: string
  children: ReactNode
}) {
  return (
    <label
      htmlFor={id}
      className="flex h-11 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-foreground/20 text-sm font-light tracking-wide text-foreground/55 transition-colors has-data-checked:border-foreground has-data-checked:text-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-foreground/25"
    >
      <RadioGroupItem
        id={id}
        value={value}
        className="absolute size-0 overflow-hidden opacity-0"
      />
      {children}
    </label>
  )
}

function NumberField({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <Field className="flex-col-reverse items-center gap-2">
      <FieldLabel htmlFor={id} className={captionClass}>
        {label}
      </FieldLabel>
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        min={1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className={numberInputClass}
      />
    </Field>
  )
}

export function TimerForm() {
  const [mode, setMode] = useState<TimerMode>("range")
  const [min, setMin] = useState("100")
  const [max, setMax] = useState("600")
  const [duration, setDuration] = useState("5")
  const [unit, setUnit] = useState<TimerUnit>("seconds")
  const [session, setSession] = useState<TimerSession | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = readTimerSession()
    if (stored) {
      setMode(stored.mode)
      setUnit(stored.unit)
      if (stored.mode === "fixed") {
        setDuration(String(stored.min))
      } else {
        setMin(String(stored.min))
        setMax(String(stored.max))
      }
      setSession(stored)
    }
    setReady(true)
  }, [])

  function handleStart(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (mode === "fixed") {
      const parsedDuration = Number.parseInt(duration, 10)

      if (!Number.isFinite(parsedDuration) || parsedDuration < 1) {
        return
      }

      const next = createTimerSession({
        mode: "fixed",
        min: parsedDuration,
        max: parsedDuration,
        unit,
      })
      writeTimerSession(next)
      setSession(next)
      return
    }

    const parsedMin = Number.parseInt(min, 10)
    const parsedMax = Number.parseInt(max, 10)

    if (
      !Number.isFinite(parsedMin) ||
      !Number.isFinite(parsedMax) ||
      parsedMin < 1 ||
      parsedMax < 1
    ) {
      return
    }

    const next = createTimerSession({
      mode: "range",
      min: parsedMin,
      max: parsedMax,
      unit,
    })
    writeTimerSession(next)
    setSession(next)
  }

  if (!ready) {
    return <div className="min-h-80 w-full max-w-md" aria-busy="true" />
  }

  if (session) {
    return (
      <Timer
        session={session}
        onBack={() => {
          clearTimerSession()
          setSession(null)
        }}
      />
    )
  }

  return (
    <Card className="w-full max-w-md gap-0 rounded-sm bg-card py-8 shadow-[0_18px_50px_rgba(0,0,0,0.08)] ring-0">
      <CardContent className="flex flex-col items-center px-8 pt-2 pb-1">
        <form
          onSubmit={handleStart}
          className="flex w-full max-w-[17rem] flex-col items-center gap-8"
        >
          <FieldSet className="w-full items-center gap-3">
            <FieldLegend variant="label" className={captionClass}>
              Mode
            </FieldLegend>
            <RadioGroup
              value={mode}
              onValueChange={(value) => {
                if (value === "range" || value === "fixed") {
                  setMode(value)
                }
              }}
              className="grid w-full grid-cols-2 gap-3"
            >
              <Choice id="timer-mode-range" value="range">
                Range
              </Choice>
              <Choice id="timer-mode-fixed" value="fixed">
                Fixed
              </Choice>
            </RadioGroup>
          </FieldSet>
          {mode === "range" ? (
            <div className="grid w-full grid-cols-2 gap-6">
              <NumberField id="timer-min" label="Min" value={min} onChange={setMin} />
              <NumberField id="timer-max" label="Max" value={max} onChange={setMax} />
            </div>
          ) : (
            <div className="w-full max-w-40">
              <NumberField
                id="timer-duration"
                label="Duration"
                value={duration}
                onChange={setDuration}
              />
            </div>
          )}
          <FieldSet className="w-full items-center gap-3">
            <FieldLegend variant="label" className={captionClass}>
              Unit
            </FieldLegend>
            <RadioGroup
              value={unit}
              onValueChange={(value) => {
                if (value === "seconds" || value === "minutes") {
                  setUnit(value)
                }
              }}
              className="grid w-full grid-cols-2 gap-3"
            >
              <Choice id="timer-unit-seconds" value="seconds">
                Seconds
              </Choice>
              <Choice id="timer-unit-minutes" value="minutes">
                Minutes
              </Choice>
            </RadioGroup>
          </FieldSet>
          <div className="flex flex-col items-center gap-2">
            <button
              type="submit"
              aria-label="Start"
              className="inline-flex size-11 items-center justify-center rounded-full border-[1.5px] border-current bg-transparent text-foreground transition-colors outline-none hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-foreground/25"
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
            </button>
            <span className={captionClass}>Start</span>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
