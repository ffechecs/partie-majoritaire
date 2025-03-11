"use client"

import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { UserProvider } from "./context"

const queryClient = new QueryClient()

export function Providers({
  children,
  sessionId,
}: {
  children: React.ReactNode
  sessionId: string
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider sessionId={sessionId}>{children}</UserProvider>
    </QueryClientProvider>
  )
}
