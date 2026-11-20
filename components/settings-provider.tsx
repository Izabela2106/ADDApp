"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import {
  DEFAULT_ALARM_SOUND_ID,
  type AlarmSoundId,
} from "@/lib/alarm-sounds"
import { DEFAULT_THEME_ID, type ThemeId } from "@/lib/themes"

interface SettingsValue {
  soundsEnabled: boolean
  setSoundsEnabled: (enabled: boolean) => void
  volume: number
  setVolume: (volume: number) => void
  alarmSoundId: AlarmSoundId
  setAlarmSoundId: (id: AlarmSoundId) => void
  themeId: ThemeId
  applyTheme: (id: ThemeId) => void
}

const SettingsContext = createContext<SettingsValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [soundsEnabled, setSoundsEnabled] = useState(true)
  const [volume, setVolume] = useState(1)
  const [alarmSoundId, setAlarmSoundId] = useState<AlarmSoundId>(
    DEFAULT_ALARM_SOUND_ID
  )
  const [themeId, setThemeId] = useState<ThemeId>(DEFAULT_THEME_ID)

  useEffect(() => {
    document.documentElement.dataset.theme = themeId
  }, [themeId])

  const value = useMemo(
    () => ({
      soundsEnabled,
      setSoundsEnabled,
      volume,
      setVolume,
      alarmSoundId,
      setAlarmSoundId,
      themeId,
      applyTheme: setThemeId,
    }),
    [soundsEnabled, volume, alarmSoundId, themeId]
  )

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  )
}

export function useSettings(): SettingsValue {
  const settings = useContext(SettingsContext)

  if (!settings) {
    throw new Error("useSettings must be used within SettingsProvider")
  }

  return settings
}
