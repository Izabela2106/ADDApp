import {
  ALARM_SOUND_DURATION_MS,
  tonesForSound,
  type AlarmSoundId,
} from "@/lib/alarm-sounds"

const MASTER_GAIN = 8

export interface PlayAlarmSoundOptions {
  soundId: AlarmSoundId
  durationMs?: number
  volume?: number
  enabled?: boolean
}

export function playAlarmSound({
  soundId,
  durationMs = ALARM_SOUND_DURATION_MS,
  volume = 1,
  enabled = true,
}: PlayAlarmSoundOptions): Promise<void> {
  const shouldPlay = enabled && volume > 0

  if (!shouldPlay) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, durationMs)
    })
  }

  const AudioContextCtor =
    window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext

  if (!AudioContextCtor) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, durationMs)
    })
  }

  const ctx = new AudioContextCtor()
  const master = ctx.createGain()
  master.gain.value = volume * MASTER_GAIN
  master.connect(ctx.destination)

  const now = ctx.currentTime
  const tones = tonesForSound(soundId)

  for (const tone of tones) {
    const delay = tone.delaySec ?? 0
    const start = now + delay
    const noteDuration = tone.durationSec ?? 1.1
    const end = start + noteDuration

    const triangle = ctx.createOscillator()
    const sine = ctx.createOscillator()
    const gain = ctx.createGain()
    const mix = ctx.createGain()

    triangle.type = "triangle"
    sine.type = "sine"
    triangle.frequency.value = tone.frequency
    sine.frequency.value = tone.frequency

    mix.gain.value = 0.55
    triangle.connect(mix)
    sine.connect(gain)
    mix.connect(gain)
    gain.connect(master)

    // Fast attack, piano-like exponential decay per note.
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(tone.peak, start + 0.02)
    gain.gain.exponentialRampToValueAtTime(
      Math.max(tone.peak * 0.001, 0.0001),
      end
    )

    triangle.start(start)
    sine.start(start)
    triangle.stop(end)
    sine.stop(end)
  }

  return new Promise((resolve) => {
    window.setTimeout(() => {
      void ctx.close().catch(() => undefined)
      resolve()
    }, durationMs)
  })
}
