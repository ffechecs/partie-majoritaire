// user context
import { createContext, useContext, useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/eden"
import { LuciaUser } from "../../../server/src/auth/lucia"

// type NonNullable<T> = T extends null | undefined ? never : T

// type User = NonNullable<
//   Awaited<ReturnType<typeof apiClient.auth.user.post>>["data"]
// >["user"]

interface UserContext {
  user: LuciaUser | undefined
  sessionId: string
  refetch: () => void
}

export const UserContext = createContext<UserContext | null>(null)

export function UserProvider({
  children,
  sessionId,
}: {
  children: React.ReactNode
  sessionId: string
}) {
  const { data, refetch } = useQuery(
    ["user", sessionId],
    () => apiClient.auth.user.post(),
    {
      // refresh on each url change
    }
  )

  return (
    <UserContext.Provider
      value={{ user: data?.data?.user, sessionId, refetch }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useContextUser() {
  const user = useContext(UserContext)
  if (!user) {
    throw new Error("useContextUser must be used within a UserProvider")
  }

  return user
}
