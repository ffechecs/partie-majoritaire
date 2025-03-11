"use client"

import { useEffect, useState } from "react"
import { useWebsocket } from "@/hooks/useWebsocket"
import { AlertCircle } from "lucide-react"

import { Game } from "../../game"

interface PageProps {
  params: {
    gameId: string
    playerId: string
  }
}

export default function Page({ params }: PageProps) {
  const [isAfter1second, setIsAfter1second] = useState(false)
  const context = useWebsocket(params.gameId, params.playerId)

  const color =
    context.info.gameInfo?.settings.challengerColor == "black" ? "w" : "b"

  useEffect(() => {
    setTimeout(() => {
      setIsAfter1second(true)
    }, 1000)
  }, [])

  if (!isAfter1second && !context.info.isConnected) {
    return <div></div>
  }

  return !context.info.isConnected ? (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-2">
      <div className="flex flex-col justify-center gap-2 rounded-md bg-red-500 p-2 text-white">
        <AlertCircle className="h-8 w-8" />
      </div>
      <div className="text-xl font-bold">Impossible de se connecter</div>
      <p>
        Veuillez fermer votre autre onglet et recharger la page pour rejoindre
        le jeu.
      </p>
    </div>
  ) : (
    <div>
      <Game context={context} color={color} playerType="majority" />
    </div>
  )
}
