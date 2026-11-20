"use server"

import { signIn, signOut } from "@/auth"
import { callbackPath } from "@/lib/oauth"

export async function signInWithOAuth(formData: FormData) {
  const provider = formData.get("provider")
  if (provider !== "google" && provider !== "github") return

  const redirectTo = callbackPath(
    typeof formData.get("redirectTo") === "string"
      ? String(formData.get("redirectTo"))
      : undefined,
  )

  await signIn(provider, { redirectTo })
}

export async function signOutUser() {
  await signOut({ redirectTo: "/login" })
}
