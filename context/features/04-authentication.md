# Authentication

Visitors sign in with Google or GitHub OAuth. Auth.js stores a signed JWT session. There is no password and no user database.

## Routes

- `/login` is public. It shows a button for each configured provider.
- `/` and `/lists` require a session. Missing sessions redirect to `/login`.
- The signed-in name and Sign out sit in the header. Sign out returns to `/login`.

## Environment

Copy `.env.example` to `.env.local`.

- `AUTH_SECRET` signs the session cookie.
- `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` enable Google. Callback: `http://localhost:3000/api/auth/callback/google`.
- `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` enable GitHub. Callback: `http://localhost:3000/api/auth/callback/github`.

Restart the dev server after changing these values. A provider appears on the login page only when both of its variables are set.
