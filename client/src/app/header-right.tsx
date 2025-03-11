"use client"

import NextLink from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  CircleUserRound,
  LogOutIcon,
  UserIcon,
  UserRound,
  Users2Icon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Link } from "@/components/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useContextUser } from "./context"

export function ContentIfAuthenticated({ sessionId }: { sessionId: string }) {
  const { user } = useContextUser()
  const router = useRouter()
  const pathName = usePathname()

  if (!user) {
    return (
      <div className="hidden items-center gap-2 md:flex">
        <Link variant="outline" href="/auth/sign-in">
          Se connecter
        </Link>
        <Link href="/auth/sign-up">Créer son compte</Link>
      </div>
    )
  }

  if (user)
    if (!user.emailVerified) {
      return (
        <div>
          {/* <span>Votre email n'a pas été vérifié</span> */}
          <Button asChild>
            {/* <Link href="/auth/verify">Vérifier mon email</Link> */}
            <Link href="/remove-cookie">Vider les cookies</Link>
          </Button>
        </div>
      )
    }

  function isAdmin() {
    return user?.role === "admin" || user?.role === "superadmin"
  }
  function isSuperAdmin() {
    return user?.role === "superadmin"
  }

  const username = user.userInfo.username
  return (
    <div className="hidden items-center gap-2 md:flex">
      <div className="text-zinc-600">{username}</div>
      {isAdmin() && (
        <div>
          <Link variant="outline" href="/game">
            Parties
          </Link>
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <UserRound className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* <DropdownMenuLabel>Mon compte</DropdownMenuLabel> */}
          <DropdownMenuItem>
            <NextLink
              className={cn(
                "flex w-full items-center gap-3",
                pathName === "/account" ? "text-blue-500" : ""
              )}
              href="/account"
            >
              <CircleUserRound className="h-5 w-5" />
              Mon compte
            </NextLink>
          </DropdownMenuItem>

          {isSuperAdmin() && (
            <DropdownMenuItem
              className={cn(pathName === "/user" ? "bg-blue-50" : "")}
            >
              <NextLink
                className={cn(
                  "flex w-full items-center gap-3",
                  pathName === "/user" ? "text-blue-500" : ""
                )}
                href="/user"
              >
                <Users2Icon className="h-5 w-5" />
                Utilisateurs
              </NextLink>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <a
              className="flex w-full items-center gap-3"
              href="/api/auth/logout"
            >
              <LogOutIcon className="h-5 w-5" />
              Déconnexion
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
