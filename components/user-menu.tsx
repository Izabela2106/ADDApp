import { signOutUser } from "@/lib/auth-actions"

const buttonClass =
  "inline-flex h-11 items-center rounded-full border-[1.5px] border-current bg-transparent px-4 text-sm font-light tracking-wide text-foreground transition-colors outline-none hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-foreground/25"

export function UserMenu({ name }: { name?: string | null }) {
  return (
    <div className="flex items-center gap-3">
      {name ? (
        <span className="max-w-40 truncate text-sm font-light text-foreground/70">
          {name}
        </span>
      ) : null}
      <form action={signOutUser}>
        <button type="submit" className={buttonClass}>
          Sign out
        </button>
      </form>
    </div>
  )
}
