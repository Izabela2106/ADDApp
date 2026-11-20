# UI

## Design system

shadcn/ui is configured with the Nova / Base UI preset. Theme tokens live in `app/globals.css`. Five app themes (`default`, `midnight`, `ocean`, `forest`, `sunset`) are applied with `data-theme` on `<html>`. Default is black and white.

`lib/utils.ts` re-exports `cn()` for merging Tailwind classes.

## Primitives

Generated files in `components/ui/` (do not edit):

- Button
- Card
- Input
- ScrollArea
- Progress
- Form elements: Field, Label, Textarea, Checkbox, Select, RadioGroup (plus Separator as a Field dependency)

## App screens

- `app/page.tsx` — landing page: timer form, countdown, and volume chooser
- `components/timerForm.tsx` — centered form with Range or Fixed mode, unit, and start
- `components/timer.tsx` — countdown display with progress bar, play, pause, and back; interval count in the top-right; after alarm sound, starts another random (range) or same (fixed) timer
- `components/settings.tsx` — settings icon and dialog (Sound, Theme)
- `components/volume-chooser.tsx` — shared volume slider on the landing page and in Sound settings
