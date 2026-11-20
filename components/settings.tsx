"use client"

import { useState } from "react"
import { SettingsIcon } from "lucide-react"

import { useSettings } from "@/components/settings-provider"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { VolumeChooser } from "@/components/volume-chooser"
import {
  ALARM_SOUND_DURATION_MS,
  ALARM_SOUNDS,
  isAlarmSoundId,
} from "@/lib/alarm-sounds"
import { playAlarmSound } from "@/lib/relaxing-sound"
import { isThemeId, THEMES } from "@/lib/themes"
import { cn } from "@/lib/utils"

type SettingsSection = "sound" | "theme"

const captionClass =
  "text-[11px] font-light tracking-[0.16em] text-foreground/55"

const outlineButtonClass =
  "inline-flex items-center justify-center rounded-full border-[1.5px] border-current bg-transparent text-foreground transition-colors outline-none hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-foreground/25"

const choiceClass =
  "flex h-11 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-foreground/20 text-sm font-light tracking-wide text-foreground/55 transition-colors has-data-checked:border-foreground has-data-checked:text-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-foreground/25"

export function Settings() {
  const [section, setSection] = useState<SettingsSection>("sound")
  const {
    soundsEnabled,
    setSoundsEnabled,
    volume,
    alarmSoundId,
    setAlarmSoundId,
    themeId,
    applyTheme,
  } = useSettings()
  const [draftThemeId, setDraftThemeId] = useState(themeId)

  function handleOpenChange(open: boolean) {
    if (open) {
      setDraftThemeId(themeId)
      setSection("sound")
    }
  }

  function handlePreview(id: (typeof ALARM_SOUNDS)[number]["id"]) {
    void playAlarmSound({
      soundId: id,
      durationMs: ALARM_SOUND_DURATION_MS,
      volume,
      enabled: soundsEnabled,
    })
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Settings"
            className={cn(outlineButtonClass, "size-11")}
          />
        }
      >
        <SettingsIcon strokeWidth={1.5} />
      </DialogTrigger>
      <DialogContent className="gap-0 rounded-sm bg-card p-0 text-foreground shadow-[0_18px_50px_rgba(0,0,0,0.08)] ring-0 sm:max-w-md [&_[data-slot=dialog-close]]:top-3.5 [&_[data-slot=dialog-close]]:right-3.5 [&_[data-slot=dialog-close]]:size-9 [&_[data-slot=dialog-close]]:rounded-full [&_[data-slot=dialog-close]]:border-[1.5px] [&_[data-slot=dialog-close]]:border-current [&_[data-slot=dialog-close]]:bg-transparent [&_[data-slot=dialog-close]]:text-foreground [&_[data-slot=dialog-close]]:shadow-none [&_[data-slot=dialog-close]]:hover:bg-foreground/5">
        <DialogHeader className="items-center px-8 pt-6 pb-1">
          <DialogTitle className={captionClass}>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6 px-8 pt-3 pb-8">
          <div className="grid grid-cols-2 gap-3">
            <SectionButton
              active={section === "sound"}
              onClick={() => setSection("sound")}
            >
              Sound
            </SectionButton>
            <SectionButton
              active={section === "theme"}
              onClick={() => setSection("theme")}
            >
              Theme
            </SectionButton>
          </div>
          {section === "sound" ? (
            <div className="flex flex-col gap-6">
              <VolumeChooser inputId="settings-volume" quiet />
              <label htmlFor="settings-sounds-off" className={choiceClass}>
                <Checkbox
                  id="settings-sounds-off"
                  checked={!soundsEnabled}
                  onCheckedChange={(checked) => {
                    setSoundsEnabled(!checked)
                  }}
                  className="absolute size-0 overflow-hidden opacity-0"
                />
                Switch off sounds
              </label>
              <div className="flex flex-col gap-3">
                <p className={captionClass}>Alarm sound</p>
                <RadioGroup
                  value={alarmSoundId}
                  onValueChange={(value) => {
                    if (typeof value === "string" && isAlarmSoundId(value)) {
                      setAlarmSoundId(value)
                    }
                  }}
                  className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1"
                >
                  {ALARM_SOUNDS.map((sound) => (
                    <div
                      key={sound.id}
                      className="flex items-center gap-2"
                    >
                      <label
                        htmlFor={`alarm-${sound.id}`}
                        className={cn(choiceClass, "flex-1 justify-start px-4")}
                      >
                        <RadioGroupItem
                          value={sound.id}
                          id={`alarm-${sound.id}`}
                          className="absolute size-0 overflow-hidden opacity-0"
                        />
                        {sound.name}
                      </label>
                      <button
                        type="button"
                        aria-label={`Play ${sound.name}`}
                        onClick={() => handlePreview(sound.id)}
                        className={cn(outlineButtonClass, "size-9 shrink-0")}
                      >
                        <PlayMark />
                      </button>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <RadioGroup
                value={draftThemeId}
                onValueChange={(value) => {
                  if (typeof value === "string" && isThemeId(value)) {
                    setDraftThemeId(value)
                  }
                }}
                className="flex flex-col gap-2"
              >
                {THEMES.map((theme) => (
                  <label
                    key={theme.id}
                    htmlFor={`theme-${theme.id}`}
                    className={cn(choiceClass, "justify-between px-4")}
                  >
                    <span className="flex items-center">
                      <RadioGroupItem
                        value={theme.id}
                        id={`theme-${theme.id}`}
                        className="absolute size-0 overflow-hidden opacity-0"
                      />
                      {theme.name}
                    </span>
                    <span className="flex items-center gap-1.5" aria-hidden>
                      {theme.swatches.map((color) => (
                        <span
                          key={color}
                          className="size-3.5 rounded-full border border-foreground/15"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </span>
                  </label>
                ))}
              </RadioGroup>
              <button
                type="button"
                onClick={() => applyTheme(draftThemeId)}
                className={cn(outlineButtonClass, "mx-auto h-11 px-8 text-sm font-light tracking-wide")}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SectionButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-11 items-center justify-center rounded-full border-[1.5px] text-sm font-light tracking-wide transition-colors outline-none focus-visible:ring-2 focus-visible:ring-foreground/25",
        active
          ? "border-foreground text-foreground"
          : "border-foreground/20 text-foreground/55 hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

function PlayMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 translate-x-px"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 7.2 16.6 12 9 16.8Z" />
    </svg>
  )
}
