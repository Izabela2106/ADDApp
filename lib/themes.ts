export const THEME_IDS = [
  "default",
  "midnight",
  "ocean",
  "forest",
  "sunset",
] as const

export type ThemeId = (typeof THEME_IDS)[number]

export interface ThemeOption {
  id: ThemeId
  name: string
  swatches: string[]
}

export const THEMES: ThemeOption[] = [
  {
    id: "default",
    name: "Default",
    swatches: ["#ffffff", "#171717", "#525252"],
  },
  {
    id: "midnight",
    name: "Midnight",
    swatches: ["#0a0a0a", "#ededed", "#a3a3a3"],
  },
  {
    id: "ocean",
    name: "Ocean",
    swatches: ["#f0f7fb", "#0c4a6e", "#0284c7"],
  },
  {
    id: "forest",
    name: "Forest",
    swatches: ["#f3f6f1", "#14532d", "#16a34a"],
  },
  {
    id: "sunset",
    name: "Sunset",
    swatches: ["#fff7ed", "#9a3412", "#ea580c"],
  },
]

export const DEFAULT_THEME_ID: ThemeId = "default"

export function isThemeId(value: string): value is ThemeId {
  return THEME_IDS.includes(value as ThemeId)
}
