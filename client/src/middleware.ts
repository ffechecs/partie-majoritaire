import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"

import { apiServer, serverUrl } from "./lib/eden"

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

const isLoggedRoute = (pathname: string) => {
  const protectedRoutes = [/^\/game/]

  return protectedRoutes.some((route) => route.test(pathname))
}

const isAdminRoute = (pathname: string) => {
  // path /game/[gameId]/replay and /game/[gameId]/spectator
  // https://pm.ffechecs.fr/game/create
  // https://pm.ffechecs.fr/game
  const protectedRoutes = [
    // /^\/game\/.*\/replay/,
    // /^\/game\/.*\/spectator/,
    /^\/game\/create/,
    /^\/game$/,
  ]

  return protectedRoutes.some((route) => route.test(pathname))
}

const isSuperAdminRoute = (pathname: string) => {
  const protectedRoutes = [/^\/user/]

  return protectedRoutes.some((route) => route.test(pathname))
}

async function getUserRole(cookieValue: string) {
  if (!cookieValue) {
    return "guest"
  }
  try {
    // make request to api

    const res = await fetch(serverUrl + "/auth/user", {
      headers: {
        Cookie: `auth_session=${cookieValue}`,
      },
    })

    if (!res.ok) {
      return "guest"
    }

    const data = (await res.json()) as {
      user: { role: "admin" | "superadmin" | "user" }
    }
    if (!data.user) {
      return "guest"
    }
    return data.user.role
  } catch (e) {
    console.log(e)
    return "guest"
  }
}

export async function middleware(request: NextRequest) {
  const url = new URL(request.url)

  if (isSuperAdminRoute(request.nextUrl.pathname)) {
    // console.log("PATH IS SUPERADMIN", request.nextUrl.pathname)
    const authSession = request.cookies.get("auth_session")
    // console.log(authSession)
    if (!authSession) {
      return NextResponse.redirect(`${url.origin}/auth/sign-up`)
    }
    const userRole = await getUserRole(authSession?.value)
    // console.log({ userRole })
    if (userRole != "superadmin") {
      return NextResponse.redirect(`${url.origin}/auth/sign-up`)
    }
  } else if (isAdminRoute(request.nextUrl.pathname)) {
    // console.log("PATH IS ADMIN", request.nextUrl.pathname)
    const authSession = request.cookies.get("auth_session")
    if (!authSession) {
      return NextResponse.redirect(`${url.origin}/auth/sign-up`)
    }
    const userRole = await getUserRole(authSession?.value)
    // console.log({ userRole })
    if (userRole != "admin" && userRole != "superadmin") {
      return NextResponse.redirect(`${url.origin}/auth/sign-up`)
    }
  } else if (isLoggedRoute(request.nextUrl.pathname)) {
    // console.log("PATH IS LOGGED", request.nextUrl.pathname)
    const authSession = request.cookies.get("auth_session")
    if (!authSession) {
      return NextResponse.redirect(`${url.origin}/auth/sign-up`)
    }
    const userRole = await getUserRole(authSession?.value)
    // console.log({ userRole })
    if (userRole == "guest") {
      return NextResponse.redirect(`${url.origin}/game`)
    }
  } else {
    // console.log("PATH IS NOT LOGGED", request.nextUrl.pathname)
  }

  return NextResponse.next()
}
