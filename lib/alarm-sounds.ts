export const ALARM_SOUND_IDS = [
  "piano-c",
  "piano-d",
  "piano-e",
  "piano-f",
  "piano-g",
  "piano-a",
  "piano-b",
  "piano-chord",
  "piano-arpeggio",
  "piano-soft",
] as const

export type AlarmSoundId = (typeof ALARM_SOUND_IDS)[number]

export interface AlarmSoundOption {
  id: AlarmSoundId
  name: string
}

export const ALARM_SOUNDS: AlarmSoundOption[] = [
  { id: "piano-c", name: "Piano C" },
  { id: "piano-d", name: "Piano D" },
  { id: "piano-e", name: "Piano E" },
  { id: "piano-f", name: "Piano F" },
  { id: "piano-g", name: "Piano G" },
  { id: "piano-a", name: "Piano A" },
  { id: "piano-b", name: "Piano B" },
  { id: "piano-chord", name: "Piano chord" },
  { id: "piano-arpeggio", name: "Piano arpeggio" },
  { id: "piano-soft", name: "Soft piano" },
]

export const DEFAULT_ALARM_SOUND_ID: AlarmSoundId = "piano-c"
export const ALARM_SOUND_DURATION_MS = 4000

export function isAlarmSoundId(value: string): value is AlarmSoundId {
  return ALARM_SOUND_IDS.includes(value as AlarmSoundId)
}

interface Tone {
  frequency: number
  peak: number
  delaySec?: number
  durationSec?: number
}

const NOTE = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A3: 220.0,
  B3: 246.94,
} as const

/** Fundamental + soft overtones for a piano-like timbre. */
function pianoNote(
  frequency: number,
  delaySec = 0,
  peak = 0.08,
  durationSec = 1.1
): Tone[] {
  return [
    { frequency, peak, delaySec, durationSec },
    { frequency: frequency * 2, peak: peak * 0.35, delaySec, durationSec },
    { frequency: frequency * 3, peak: peak * 0.12, delaySec, durationSec },
  ]
}

/** Spread a melody of notes evenly across ~4 seconds. */
function melody(freqs: number[], peak = 0.08): Tone[] {
  const step = 3.2 / Math.max(freqs.length - 1, 1)
  return freqs.flatMap((frequency, index) =>
    pianoNote(frequency, index * step, peak, 1.15)
  )
}

export function tonesForSound(id: AlarmSoundId): Tone[] {
  switch (id) {
    case "piano-c":
      return melody([NOTE.C4, NOTE.E4, NOTE.G4, NOTE.C5, NOTE.G4, NOTE.E4])
    case "piano-d":
      return melody([NOTE.D4, NOTE.F4, NOTE.A4, NOTE.D5, NOTE.A4, NOTE.F4])
    case "piano-e":
      return melody([NOTE.E4, NOTE.G4, NOTE.B4, NOTE.E5, NOTE.B4, NOTE.G4])
    case "piano-f":
      return melody([NOTE.F4, NOTE.A4, NOTE.C5, NOTE.F5, NOTE.C5, NOTE.A4])
    case "piano-g":
      return melody([NOTE.G4, NOTE.B4, NOTE.D5, NOTE.G5, NOTE.D5, NOTE.B4])
    case "piano-a":
      return melody([NOTE.A4, NOTE.C5, NOTE.E5, NOTE.A4, NOTE.E5, NOTE.C5])
    case "piano-b":
      return melody([NOTE.B3, NOTE.D4, NOTE.F4, NOTE.B4, NOTE.F4, NOTE.D4])
    case "piano-chord":
      return [
        ...pianoNote(NOTE.C4, 0, 0.06, 1.4),
        ...pianoNote(NOTE.E4, 0, 0.05, 1.4),
        ...pianoNote(NOTE.G4, 0, 0.045, 1.4),
        ...pianoNote(NOTE.G4, 1.35, 0.06, 1.4),
        ...pianoNote(NOTE.B4, 1.35, 0.05, 1.4),
        ...pianoNote(NOTE.D5, 1.35, 0.045, 1.4),
        ...pianoNote(NOTE.C4, 2.7, 0.06, 1.3),
        ...pianoNote(NOTE.E4, 2.7, 0.05, 1.3),
        ...pianoNote(NOTE.G4, 2.7, 0.045, 1.3),
        ...pianoNote(NOTE.C5, 2.7, 0.04, 1.3),
      ]
    case "piano-arpeggio":
      return melody([
        NOTE.C4,
        NOTE.E4,
        NOTE.G4,
        NOTE.C5,
        NOTE.E5,
        NOTE.C5,
        NOTE.G4,
        NOTE.E4,
      ])
    case "piano-soft":
      return melody(
        [NOTE.A3, NOTE.C4, NOTE.E4, NOTE.A4, NOTE.E4, NOTE.C4],
        0.05
      )
  }
}
