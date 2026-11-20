# Progress Tracker

## Current task

**04-authentication** — Google and GitHub OAuth gate the timer and lists

Status: done

## Checklist

- [x] Landing page is the timer form / countdown
- [x] Visual timer routes and components removed
- [x] Home marketing page removed
- [x] Navbar tabs removed (brand + settings remain)
- [x] No TypeScript or ESLint errors
- [x] Unauthenticated visits to / and /lists redirect to /login
- [x] Login page lists Google and GitHub once their env vars are set
- [x] Signed-in header shows the account name and Sign out

## Completed

- **01-design** — shadcn/ui (Nova / Base UI) is configured. Installed Button, Card, Input, ScrollArea, and form elements (Field, Label, Textarea, Checkbox, Select, RadioGroup). `lib/utils.ts` re-exports `cn()`. Theme tokens in `app/globals.css` keep the original light/dark background and foreground colors.
- **02-layout** — Main page shows a centered `TimerForm` (range min/max, seconds or minutes, start). Start swaps in `Timer`, which picks a random duration in that range, counts down (seconds only, or minutes:seconds), pauses on Pause, resumes on Play, then after expiry plays a 3s relaxing tone and starts another random countdown. No dialogs.
- **03-settings** — Settings icon at the top right opens a shadcn dialog. Left list switches Sound and Theme. Sound: volume, mute, 10 alarm tones with preview play. Theme: Default (black and white), Midnight, Ocean, Forest, Sunset with swatches; Save applies `data-theme` on the document. Main page also has a volume chooser that shares the same volume setting.
- **04-visual-timer** — _(removed)_ Visual timers were removed; timer is the sole landing experience.
- **interval-counter** — Completed-interval count is in the top-right of the digital timer, with no border. Increments when an interval ends; resets when a new timer session starts.
- **landing-timer** — `/` is the timer. Visual timer code, `/timer`, and the multi-tab navbar are gone.
- **04-authentication** — Auth.js OAuth (Google and GitHub) with a JWT session. `/login` is public; `/` and `/lists` require a signed-in user. Header shows the account name and Sign out.

## Open questions

_(none)_
