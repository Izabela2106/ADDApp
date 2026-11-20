"use client"

import { cn } from "cn"

import { Field, FieldLabel } from "@/components/ui/field"
import { useSettings } from "@/components/settings-provider"

export function VolumeChooser({
  inputId = "volume",
  quiet = false,
}: {
  inputId?: string
  quiet?: boolean
}) {
  const { volume, setVolume, soundsEnabled } = useSettings()

  return (
    <Field className={quiet ? "items-center gap-3" : undefined}>
      <FieldLabel
        htmlFor={inputId}
        className={
          quiet
            ? "text-[11px] font-light tracking-[0.16em] text-foreground/55"
            : undefined
        }
      >
        Volume
      </FieldLabel>
      <input
        id={inputId}
        type="range"
        min={0}
        max={100}
        value={Math.round(volume * 100)}
        disabled={!soundsEnabled}
        onChange={(event) => {
          setVolume(Number(event.target.value) / 100)
        }}
        className={cn(
          "w-full disabled:opacity-30",
          quiet ? "accent-foreground" : "accent-primary"
        )}
      />
    </Field>
  )
}
