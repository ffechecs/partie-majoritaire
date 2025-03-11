"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { apiClient } from "@/lib/eden"
import { Button } from "@/components/ui/button"

export function PlayerForm({ gameId }: { gameId: string }) {
  const [name, setName] = useState<string>("")
  const router = useRouter()

  async function createGame(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const result = await apiClient.players.post({ name: name })
    if (result.error || !result.data) return console.error(result.error)
    console.log(result)
    router.push(`/game/${gameId}/majority/${result.data.id}`)
  }
  async function join() {
    const result = await apiClient.players.post({ name: "userId" })
    if (result.error || !result.data) return console.error(result.error)
    console.log(result)
    router.push(`/game/${gameId}/majority/${result.data.id}`)
  }

  async function test() {
    const name = "test"
    const res = await fetch("/api/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name }),
    })
    console.log(res)
  }

  return (
    <div>
      {/* <Button onClick={test}>Test</Button> */}
      <Button onClick={join}>Rejoindre</Button>
      {/* <form className="flex flex-col gap-3" onSubmit={createGame}>
        <div className="flex gap-1 flex-col">
          <label htmlFor="name">Nom</label>
          <input
            className="border-2 p-1 rounded-sm border-gray-500"
            name="name"
            type="text"
            value={name}
            placeholder="Nom du joueur"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Button type="submit">Créer un joueur</Button>
      </form> */}
    </div>
  )
}
