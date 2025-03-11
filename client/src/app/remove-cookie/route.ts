import { cookies } from "next/headers"
import { NextRequest } from "next/server"

export function GET(req: NextRequest) {
  const cookieStore = cookies()

  // remove cookie and redirect to home page

  const cookiesToRemove = ["auth_session", "sign_in_email"]

  for (const cookie of cookiesToRemove) {
    cookieStore.delete(cookie)
  }

  return new Response("", {
    status: 302,
    headers: {
      Location: "/",
    },
  })
}
