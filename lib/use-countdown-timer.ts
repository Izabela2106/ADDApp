"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { useSettings } from "@/components/settings-provider"
import { ALARM_SOUND_DURATION_MS } from "@/lib/alarm-sounds"
import { playAlarmSound } from "@/lib/relaxing-sound"
import { nextDurationSeconds } from "@/lib/timer"
import {
  secondsLeft,
  writeTimerSession,
  type TimerSession,
} from "@/lib/timer-session"

export function useCountdownTimer(session: TimerSession) {
  const { mode, min, max, unit } = session
  const { alarmSoundId, volume, soundsEnabled } = useSettings()
  const [duration, setDuration] = useState(session.duration)
  const [remaining, setRemaining] = useState(session.remaining)
  const [paused, setPausedState] = useState(session.paused)
  const [phase, setPhase] = useState(session.phase)
  const [completedSeconds, setCompletedSeconds] = useState(
    session.completedSeconds
  )
  const [intervalCount, setIntervalCount] = useState(session.intervalCount)
  const [clock, setClock] = useState({
    remaining: session.remaining,
    updatedAt: session.updatedAt,
  })
  const countedCurrentInterval = useRef(session.phase === "sound")
  const clockRef = useRef(clock)
  const pausedRef = useRef(paused)
  const phaseRef = useRef(phase)
  const durationRef = useRef(duration)
  const completedRef = useRef(completedSeconds)
  const intervalCountRef = useRef(intervalCount)

  const beginNext = useCallback(() => {
    if (phaseRef.current !== "sound") return

    const nextDuration = nextDurationSeconds(mode, { min, max, unit })
    const now = Date.now()
    phaseRef.current = "running"
    pausedRef.current = false
    countedCurrentInterval.current = false
    durationRef.current = nextDuration
    clockRef.current = { remaining: nextDuration, updatedAt: now }
    setDuration(nextDuration)
    setClock(clockRef.current)
    setRemaining(nextDuration)
    setPausedState(false)
    setPhase("running")
  }, [mode, min, max, unit])

  const enterSound = useCallback(() => {
    if (phaseRef.current === "sound" || pausedRef.current) return

    const now = Date.now()
    const nextCompleted = completedRef.current + durationRef.current
    const nextCount = intervalCountRef.current + 1
    phaseRef.current = "sound"
    countedCurrentInterval.current = true
    completedRef.current = nextCompleted
    intervalCountRef.current = nextCount
    clockRef.current = { remaining: 0, updatedAt: now }
    setClock(clockRef.current)
    setRemaining(0)
    setCompletedSeconds(nextCompleted)
    setIntervalCount(nextCount)
    setPhase("sound")
  }, [])

  function setPaused(next: boolean) {
    if (next === pausedRef.current || phaseRef.current === "sound") return

    const now = Date.now()
    if (next) {
      const left = secondsLeft(
        { ...clockRef.current, paused: false },
        now
      )
      clockRef.current = { remaining: left, updatedAt: now }
      setClock(clockRef.current)
      setRemaining(left)
    } else {
      clockRef.current = {
        remaining: clockRef.current.remaining,
        updatedAt: now,
      }
      setClock(clockRef.current)
    }

    pausedRef.current = next
    setPausedState(next)
  }

  useEffect(() => {
    writeTimerSession({
      mode,
      min,
      max,
      unit,
      duration,
      remaining: clock.remaining,
      paused,
      phase,
      completedSeconds,
      intervalCount,
      updatedAt: clock.updatedAt,
    })
  }, [
    mode,
    min,
    max,
    unit,
    duration,
    clock,
    paused,
    phase,
    completedSeconds,
    intervalCount,
  ])

  useEffect(() => {
    function onPageHide() {
      writeTimerSession({
        mode,
        min,
        max,
        unit,
        duration: durationRef.current,
        remaining: clockRef.current.remaining,
        paused: pausedRef.current,
        phase: phaseRef.current,
        completedSeconds: completedRef.current,
        intervalCount: intervalCountRef.current,
        updatedAt: clockRef.current.updatedAt,
      })
    }

    window.addEventListener("pagehide", onPageHide)
    return () => window.removeEventListener("pagehide", onPageHide)
  }, [mode, min, max, unit])

  useEffect(() => {
    if (paused || phase !== "running") return

    function tick() {
      if (pausedRef.current || phaseRef.current !== "running") return

      const left = secondsLeft(
        { ...clockRef.current, paused: false },
        Date.now()
      )

      if (left <= 0) {
        enterSound()
        return
      }

      setRemaining(left)
    }

    tick()
    const id = window.setInterval(tick, 250)
    return () => window.clearInterval(id)
  }, [paused, phase, enterSound])

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState !== "visible") return

      if (phaseRef.current === "sound") {
        const elapsed = Date.now() - clockRef.current.updatedAt
        if (elapsed >= ALARM_SOUND_DURATION_MS) beginNext()
        return
      }

      if (pausedRef.current || phaseRef.current !== "running") return

      const left = secondsLeft(
        { ...clockRef.current, paused: false },
        Date.now()
      )

      if (left <= 0) {
        enterSound()
        return
      }

      setRemaining(left)
    }

    document.addEventListener("visibilitychange", onVisible)
    return () => document.removeEventListener("visibilitychange", onVisible)
  }, [beginNext, enterSound])

  useEffect(() => {
    if (phase !== "sound") return

    let cancelled = false

    void playAlarmSound({
      soundId: alarmSoundId,
      durationMs: ALARM_SOUND_DURATION_MS,
      volume,
      enabled: soundsEnabled,
    }).finally(() => {
      if (!cancelled) beginNext()
    })

    return () => {
      cancelled = true
    }
  }, [phase, beginNext, alarmSoundId, volume, soundsEnabled])

  const progress = duration > 0 ? remaining / duration : 0
  const currentElapsed =
    phase === "running" || !countedCurrentInterval.current
      ? Math.max(0, duration - remaining)
      : 0
  const totalSeconds = completedSeconds + currentElapsed

  return {
    remaining,
    totalSeconds,
    paused,
    phase,
    progress,
    intervalCount,
    setPaused,
  }
}
