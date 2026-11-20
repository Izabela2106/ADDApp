import NextAuth from "next-auth"

import { getOAuthProviders } from "@/lib/oauth"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: getOAuthProviders(),
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl
      if (pathname === "/login" || pathname.startsWith("/api/auth")) {
        return true
      }
      return !!session?.user
    },
  },
})
