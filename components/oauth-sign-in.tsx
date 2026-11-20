import { signInWithOAuth } from "@/lib/auth-actions"
import type { OAuthChoice } from "@/lib/oauth"

const buttonClass =
  "inline-flex h-11 w-full items-center justify-center rounded-full border-[1.5px] border-current bg-transparent px-4 text-sm font-light tracking-wide text-foreground transition-colors outline-none hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-foreground/25"

export function OAuthSignIn({
  providers,
  redirectTo,
}: {
  providers: OAuthChoice[]
  redirectTo: string
}) {
  return (
    <div className="flex w-full flex-col gap-3">
      {providers.map((provider) => (
        <form key={provider.id} action={signInWithOAuth}>
          <input type="hidden" name="provider" value={provider.id} />
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button type="submit" className={buttonClass}>
            {provider.label}
          </button>
        </form>
      ))}
    </div>
  )
}
