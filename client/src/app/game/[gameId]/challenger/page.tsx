"use client"

import { useWebsocket } from "@/hooks/useWebsocket"

import { Game } from "../game"

interface PageProps {
  params: {
    gameId: string
  }
}

export default function Page({ params }: PageProps) {
  const context = useWebsocket(params.gameId, undefined)

  const color =
    context.info.gameInfo?.settings.challengerColor == "black" ? "b" : "w"

  return (
    <div>
      {!context.info.isConnected ? (
        <div>Not connected</div>
      ) : (
        <Game context={context} playerColor={color} playerType="challenger" />
      )}
    </div>
  )
}
