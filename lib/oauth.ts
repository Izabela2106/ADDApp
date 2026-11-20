import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

export interface OAuthChoice {
  id: "google" | "github"
  label: string
}

function hasGoogle() {
  return Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET)
}

function hasGitHub() {
  return Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET)
}

export function getOAuthProviders(): NextAuthConfig["providers"] {
  const providers: NextAuthConfig["providers"] = []
  if (hasGoogle()) providers.push(Google)
  if (hasGitHub()) providers.push(GitHub)
  return providers
}

export function getOAuthChoices(): OAuthChoice[] {
  const choices: OAuthChoice[] = []
  if (hasGoogle()) {
    choices.push({ id: "google", label: "Continue with Google" })
  }
  if (hasGitHub()) {
    choices.push({ id: "github", label: "Continue with GitHub" })
  }
  return choices
}

export function callbackPath(value: string | undefined) {
  const path = toLocalPath(value)
  if (
    !path ||
    path === "/login" ||
    path.startsWith("/login?") ||
    path.startsWith("/api/auth")
  ) {
    return "/"
  }
  return path
}

function toLocalPath(value: string | undefined) {
  if (!value) return "/"
  if (value.startsWith("/") && !value.startsWith("//")) return value
  try {
    const url = new URL(value)
    return `${url.pathname}${url.search}` || "/"
  } catch {
    return "/"
  }
}
