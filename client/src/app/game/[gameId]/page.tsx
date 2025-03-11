"use client"

import { useContextUser } from "@/app/context"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/eden"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyButton } from "../page"
import { EditForm } from "./edit-form"

export default function Page({ params }: { params: { gameId: string } }) {
  const user = useContextUser()
  const { data, refetch } = useQuery(["game", params.gameId], () =>
    apiClient.games[params.gameId].get()
  )
  if (!data) return <div>Loading...</div>

  if (data?.error) {
    return <div>Content {data.error.message}</div>
  }

  // const []
  // const gameData = await apiClient.games[params.gameId].get()
  // if (gameData.error) {
  //   return <div>Content {gameData.error.message}</div>
  // }
  // if (gameData.data.game === undefined) {
  //   return <div>Content {gameData.error}</div>
  // }
  const game = data?.data.game!
  return (
    <div className="m-16 flex flex-col items-center justify-center">
      <h1 className="text-center text-4xl font-bold text-gray-800 dark:text-gray-100">
        Partie: {game.name}
      </h1>
      <p className="py-4 text-center">
        Vous êtes sur la page de la partie.
        <br />
        Voici les liens de connexions pour le Champion et les joueurs du côté
        majoritaire
      </p>

      <div className="mt-4 flex w-full max-w-md flex-col divide-y divide-zinc-200 rounded-md border border-zinc-200">
        <div className="flex items-center justify-between gap-5 px-3 py-2">
          <span>Code Champion</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl font-bold">
              {game.challengerCode}
            </span>
            <CopyButton value={game.challengerCode} />
          </div>
        </div>
        <li className="flex items-center justify-between gap-5 px-3 py-2">
          <span>Code Majorité</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl font-bold">
              {game.majorityCode}
            </span>
            <CopyButton value={game.majorityCode} />
          </div>
        </li>
      </div>
      {user.user && user.user.id == game.createdBy && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Modifier la partie</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Modifier la partie
            </h2> */}
            <EditForm game={game} refetch={refetch} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
