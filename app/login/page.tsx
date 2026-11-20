import { redirect } from "next/navigation"

import { OAuthSignIn } from "@/components/oauth-sign-in"
import { auth } from "@/auth"
import { callbackPath, getOAuthChoices } from "@/lib/oauth"

const errorCopy: Record<string, string> = {
  Configuration:
    "OAuth is not configured yet. Add a provider client id and secret, then restart the app.",
  AccessDenied: "That account is not allowed to sign in.",
  OAuthAccountNotLinked:
    "This email is already linked to a different sign-in provider.",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>
}) {
  const session = await auth()
  if (session?.user) redirect("/")

  const params = await searchParams
  const providers = getOAuthChoices()
  const redirectTo = callbackPath(params.callbackUrl)
  const errorMessage = params.error
    ? (errorCopy[params.error] ?? "Sign-in failed. Try again.")
    : null

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center p-6">
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-medium tracking-tight">Sign in</h1>
          <p className="text-sm font-light leading-relaxed text-foreground/55">
            Use Google or GitHub to open the timer and your lists.
          </p>
        </div>
        {errorMessage ? (
          <p className="text-sm font-light text-destructive" role="alert">
            {errorMessage}
          </p>
        ) : null}
        {providers.length > 0 ? (
          <OAuthSignIn providers={providers} redirectTo={redirectTo} />
        ) : (
          <div className="w-full rounded-2xl border border-border px-5 py-4 text-left text-sm font-light leading-relaxed text-foreground/70">
            <p>
              Add one of these pairs to .env.local, then restart the dev server.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET</li>
              <li>AUTH_GITHUB_ID and AUTH_GITHUB_SECRET</li>
            </ul>
            <p className="mt-3">
              Callback URLs: http://localhost:3000/api/auth/callback/google and
              http://localhost:3000/api/auth/callback/github.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
