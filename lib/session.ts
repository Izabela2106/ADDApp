import { cache } from "react"
import { redirect } from "next/navigation"

import { auth } from "@/auth"

export const verifySession = cache(async () => {
  const session = await auth()
  const user = session?.user
  if (!user) redirect("/login")
  return { ...session, user }
})
