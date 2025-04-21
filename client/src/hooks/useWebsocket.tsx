import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import {
  EdenAppSubscription,
  WsBodyReqType,
  WsBodyResType,
  apiServer,
} from "@/lib/eden"
import { type WsResponseSchema } from "../types/eden"

type FindType<
  TWhere extends { type: string },
  TExtend extends TWhere["type"],
> = TWhere extends { type: TExtend } ? TWhere : never

type Players = FindType<WsResponseSchema, "connect">["data"]["players"]
type Move = FindType<WsResponseSchema, "move">["move"]
type Vote = FindType<WsResponseSchema, "vote">["vote"]
type FrontendVote = Omit<Vote, "id" | "createdAt"> // Incomplete vote from frontend
type GameInfo = FindType<WsResponseSchema, "connect">["data"]["game"]

export function useWebsocket(
  gameId: string | undefined,
  playerId: string | undefined
) {
  const [chat, setChat] = useState<EdenAppSubscription>()
  const isConnected = chat
  const [players, setPlayers] = useState<Players>([])
  const [lastMove, setLastMove] = useState<Move | null>()
  const [moves, setMoves] = useState<Move[]>([])
  const [votes, setVotes] = useState<Vote[]>([])
  const [allUserVotes, setAllUserVotes] = useState<Vote[]>([])
  const [hasUserVoted, setHasUserVoted] = useState<boolean>(false)
  const [lastUserVote, setLastUserVote] = useState<Vote | FrontendVote | null>(
    null
  )
  const [gameInfo, setGameInfo] = useState<GameInfo>()
  const [winner, setWinner] = useState<string>()

  useEffect(() => {
    if (!gameId) {
      return
    }

    const currentChat = apiServer.ws.subscribe({
      $query: {
        gameId: gameId,
        playerId: !playerId ? "undefined" : playerId,
      },
    })
    currentChat.on("open", (data) => {
      setChat(currentChat)
    })
    let localGameInfo: GameInfo | undefined = undefined
    currentChat.on("message", ({ data }) => {
      const message = data as WsBodyReqType
      if (message.type == "connect") {
        localGameInfo = message.data.game
        setGameInfo(message.data.game)
        setPlayers(message.data.players)
        setVotes(message.data.votes)
        setLastMove(message.data.lastMove)
        setHasUserVoted(message.data.hasUserVoted)
        setLastUserVote(message.data.lastUserVote)
        setMoves(message.data.moves)
        setAllUserVotes(message.data.allUserVotes)
      } else if (message.type == "playerConnect") {
        setPlayers((schools) => [...schools, message.player])
      } else if (message.type == "playerDisconnect") {
        setPlayers((schools) => schools.filter((s) => s.id != message.playerId))
      } else if (message.type == "move") {
        setWinner(undefined)
        setHasUserVoted(false)
        setLastUserVote(null)
        setLastMove(message.move)
        if (message.move.color == localGameInfo?.settings.challengerColor) {
          setVotes([])
        }
        setMoves((moves) => [...moves, message.move])
      } else if (message.type == "vote") {
        setVotes((votes) => [...votes, message.vote])
        if (message.vote.playerId == playerId) {
          setAllUserVotes((votes) => [...votes, message.vote])
        }
      } else if (message.type == "gameOver") {
        console.log("game over", message.winner)
        setWinner(message.winner)
      } else if (message.type == "refresh") {
        window.location.reload()
      }
    })
    currentChat.on("close", (data) => {
      setChat(undefined)
    })
    return () => {
      currentChat.close()
    }
  }, [gameId, playerId])

  function mySend(data: WsBodyResType) {
    if (!chat) {
      throw new Error("No chat")
    }

    if (typeof data == "object" && "type" in data) {
      if (data.type == "vote") {
        setHasUserVoted(true)
        setLastUserVote(data.data)
      }
    }
    chat.send(data)
  }

  const info = {
    playerId,
    gameId: gameId,
    isConnected,
    gameInfo,
  }

  return {
    info,
    players,
    hasUserVoted,
    lastUserVote,
    lastMove,
    votes,
    allUserVotes,
    send: mySend,
    winner,
    moves,
  }
}
