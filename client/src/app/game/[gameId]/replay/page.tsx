"use client"

import { useEffect, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Chess } from "chess.js"
import {
  Play,
  SkipBack,
  SkipForward,
  StepBack,
  StepForward,
} from "lucide-react"

import { apiClient } from "@/lib/eden"
import { cn } from "@/lib/utils"
import { Board } from "@/components/board"
import { Move, Vote } from "../../../../../../server/src/db/schema/game"
import { VotesDisplay, convertToFrenchNotation } from "../game"

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

interface PageProps {
  params: {
    gameId: string
  }
}

export function MovesDisplay({
  allGameStates,
  selectedIndex,
  onsSelectIndex,
}: {
  allGameStates: GameState[]
  selectedIndex: number
  onsSelectIndex: (index: number) => void
}) {
  // const containerRef = useRef<HTMLDivElement>(null)

  // const scrollToBottom = () => {
  //   containerRef.current?.scrollTo({
  //     top: containerRef.current?.scrollHeight,
  //     behavior: "smooth",
  //   })
  // }
  const group: ([GameState, GameState] | [GameState])[] = []

  // group by 2
  for (let i = 1; i < allGameStates.length; i += 2) {
    if (i + 1 == allGameStates.length) {
      group.push([allGameStates[i]])
    } else {
      group.push([allGameStates[i], allGameStates[i + 1]])
    }
  }

  function M1M2({ m1, m2 }: { m1: GameState; m2: GameState | undefined }) {
    return (
      <>
        <div
          onClick={() =>
            onsSelectIndex && onsSelectIndex(m1.move!.moveNumber + 1)
          }
          className={cn(
            "p-2 text-sm text-gray-700",
            m1.move && m1.move.moveNumber + 1 == selectedIndex
              ? "bg-zinc-100"
              : ""
          )}
        >
          {m1.move!.moveSan ? convertToFrenchNotation(m1.move!.moveSan) : ""}
        </div>
        <div
          onClick={() =>
            m2 && onsSelectIndex && onsSelectIndex(m2.move!.moveNumber + 1)
          }
          className={cn(
            "p-2 text-sm text-gray-700",
            m2 && m2.move && m2.move.moveNumber + 1 == selectedIndex
              ? "bg-zinc-100"
              : ""
          )}
        >
          {m2?.move!.moveSan ? convertToFrenchNotation(m2?.move!.moveSan) : ""}
        </div>
      </>
    )
  }

  // useEffect(() => {
  //   scrollToBottom()
  // }, [allGameStates])

  return (
    <div
      style={{
        height: "148px",
      }}
      className="flex flex-col rounded-sm border-2"
    >
      <div className="grid h-12 w-full grid-cols-4 gap-2 bg-zinc-200 text-zinc-500">
        {onsSelectIndex && (
          <button
            disabled={selectedIndex == 0}
            className="flex items-center justify-center p-4 disabled:opacity-50"
            onClick={() => {
              onsSelectIndex(0)
            }}
          >
            <SkipBack size={16} />
          </button>
        )}
        {onsSelectIndex && (
          <button
            disabled={selectedIndex == 0}
            className="flex items-center justify-center p-4 disabled:opacity-50"
            onClick={() => {
              if (selectedIndex - 1 >= 0) {
                onsSelectIndex(selectedIndex - 1)
              }
            }}
          >
            <Play size={16} className="rotate-180" />
          </button>
        )}
        {onsSelectIndex && (
          <button
            disabled={selectedIndex == allGameStates.length - 1}
            className="flex items-center justify-center p-4 disabled:opacity-50"
            onClick={() => {
              if (selectedIndex + 1 < allGameStates.length) {
                onsSelectIndex(selectedIndex + 1)
              }
            }}
          >
            <Play size={16} />
          </button>
        )}
        {onsSelectIndex && (
          <button
            disabled={selectedIndex == allGameStates.length - 1}
            className="flex items-center justify-center p-4 disabled:opacity-50"
            onClick={() => {
              onsSelectIndex(allGameStates.length - 1)
            }}
          >
            <SkipForward size={16} />
          </button>
        )}
      </div>
      <div
        // ref={containerRef}
        className="flex h-[100px] flex-col overflow-y-auto"
        // className="flex flex-col"
      >
        {group.map(([m1, m2], i) => (
          <div key={i} className="flex flex-col">
            <div className="items-strech flex">
              <div className="flex w-[100px] items-center justify-center bg-zinc-200 text-center text-zinc-600">
                <span>{i + 1}</span>
              </div>
              <div className="grid w-full grid-cols-2 gap-2">
                <M1M2 m1={m1} m2={m2} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
type GameState = {
  fen: string
  move: Move | undefined
  votes: Vote[] | undefined
}

function getAllGameState(
  game: Awaited<
    ReturnType<(typeof apiClient.games)[":id"]["full"]["get"]>
  >["data"]
) {
  if (!game) return []
  const allGameStates: GameState[] = [
    {
      fen: START_FEN,
      move: undefined,
      votes: undefined,
    },
  ]

  const moves = game.game.moves
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i]
    const fen = move.fen
    const votes = game.game.votes.filter((v) => v.moveNumber == i)
    allGameStates.push({ fen, move, votes })
  }
  return allGameStates
}

function PageContent({
  game,
}: {
  game: Awaited<
    ReturnType<(typeof apiClient.games)[":id"]["full"]["get"]>
  >["data"]
}) {
  const allGameStates = getAllGameState(game)

  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!game) return null

  const color =
    game.game.settings.challengerColor == "white" ? "black" : "white"

  return (
    <div className="flex flex-1 justify-center gap-4">
      <div className="relative w-[500px] overflow-hidden rounded-sm">
        <Board
          arePiecesDraggable={false}
          // key={"board_" + game.fen() + "_" + context.winner}
          //   boardOrientation={color == "w" ? "white" : "black"}
          // boardWidth={500}
          position={allGameStates[selectedIndex].fen}
          boardOrientation={color}
          //   customSquareStyles={customSquareStyles}
          //   customArrows={customArrows}
          //   onSquareClick={onSquareClick}
          //   onPieceDragBegin={onPieceDragBegin}
          //   isDraggablePiece={isDraggablePiece}
          //   onPieceDrop={onPieceDrop}
        />
      </div>
      <div className="flex w-[400px] flex-col gap-4">
        <MovesDisplay
          allGameStates={allGameStates}
          selectedIndex={selectedIndex}
          onsSelectIndex={(newIndex) => setSelectedIndex(newIndex)}
        />
        <VotesDisplay
          votes={allGameStates[selectedIndex].votes || []}
          showMove={true}
        />
      </div>
    </div>
  )
}

export default function Page({ params }: PageProps) {
  const { data, refetch } = useQuery(["game", params.gameId, "full"], () =>
    apiClient.games[params.gameId].full.get()
  )

  if (!data || !data.data) return <div>Loading...</div>

  const game = data?.data!

  return (
    <div className="flex flex-col items-center justify-center pt-8">
      <h1 className="mb-5 text-center text-3xl font-bold">
        Partie : {game?.game?.name}
      </h1>
      <PageContent game={game} />
    </div>
  )
}
