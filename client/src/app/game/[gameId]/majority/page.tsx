"use client"

import { AccountForm } from "@/app/account/account-form"
import { useContextUser } from "@/app/context"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/eden"
import { PlayerForm } from "./player-form"

const text =
  "Vous allez jouer du côté de la majorité, vous devez voter pour le coup que vous pensez être le meilleur."

export default function Page({ params }: { params: { gameId: string } }) {
  const { user } = useContextUser()
  const { data, refetch } = useQuery(["game", params.gameId], () =>
    apiClient.games[params.gameId].get()
  )
  // const { data: players } = useQuery(["players", params.gameId], () =>
  //   apiClient.players.get()
  // )
  if (!data || !data.data) return <div>Loading...</div>
  const game = data?.data.game

  return (
    <div className="flex flex-col items-center justify-center pt-16">
      <h1 className="mb-5 text-center text-4xl font-bold">
        Partie : {game?.name}
      </h1>
      <p className="mb-5 w-[500px] text-center text-sm text-zinc-500">{text}</p>
      {/* <Card>
        <CardHeader>
          <CardTitle>Créer un joueur</CardTitle>
        </CardHeader>
        <CardContent> */}
      {(!game?.settings.isGameForSchools ||
        (game?.settings.isGameForSchools && user?.userInfo.isSchool)) && (
        <div className="mx-auto flex-1">
          <PlayerForm gameId={params.gameId} />
        </div>
      )}
      {/* </CardContent>
      </Card> */}
      {game?.settings.isGameForSchools && !user?.userInfo.isSchool && (
        <div className="mx-auto max-w-2xl flex-1 py-4">
          <div className="pb-4">
            <span className="font-bold text-red-600">
              Cette partie est à destination des établissements scolaires,
              veuillez modifier votre profil pour rejoindre la partie.
            </span>
          </div>
          <AccountForm user={user} />
        </div>
      )}
    </div>
  )
}
