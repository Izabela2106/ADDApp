# PWA

The timer can be installed and opened like a mobile app: a home-screen icon and a standalone window, without the browser toolbar.

## Install

- `app/manifest.ts` names the app, sets `display: standalone`, and points at the icons in `public/icons/`.
- `public/sw.js` registers a service worker with a fetch handler so Chromium can offer installation. It caches only `/icons/*`. Pages, the session, and `/api` always use the network.
- Chrome and Edge show an Install banner when `beforeinstallprompt` fires. iPhone Safari shows Share → Add to Home Screen. Not now hides the banner on that device.
- Opening the installed app loads `/`. A saved session goes to the timer. Otherwise the login page is shown.

## Public files

`/sw.js` and `/manifest.webmanifest` are excluded from the auth gate so the browser can install the app before anyone is signed in.
