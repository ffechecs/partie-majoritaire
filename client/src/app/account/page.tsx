"use client"

import { useContextUser } from "../context"
import { AccountForm } from "./account-form"

export default function Page() {
  const { user } = useContextUser()

  if (!user) {
    return <div>Loading...</div>
  }
  return (
    <div className="flex-1">
      <div className="mx-auto max-w-2xl flex-1 py-12">
        <h1 className="mb-4 text-center text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Votre compte
        </h1>
        <AccountForm user={user} />
      </div>
    </div>
  )
}
