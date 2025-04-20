/* eslint-disable @next/next/no-img-element */
"use client"

import { JSX, ReactNode, useEffect, useRef, useState } from "react"
import { useWebsocket } from "@/hooks/useWebsocket"
import * as Dialog from "@radix-ui/react-dialog"
import { Chess, Square } from "chess.js"
import {
  CustomSquareStyles,
  Piece,
} from "react-chessboard/dist/chessboard/types"
import Countdown from "react-countdown"

import { cn } from "@/lib/utils"
import { Board } from "@/components/board"
import { Link } from "@/components/link"
import { Button } from "@/components/ui/button"
import {
  LockCountdown,
  getTimeRenderer,
} from "@/components/utils/time-renderer"
import { Move } from "../../../../../server/src/db/schema/game"

interface GameProps {
  playerColor: "w" | "b"
  playerType: "spectator" | "challenger" | "majority"
  context: ReturnType<typeof useWebsocket>
}

type MajorityGameState =
  | "C'est le moment du vote"
  | "En attente des autres votes"
  | "En attente du coup du Champion"
  | "Victoire du Champion!"
  | "Victoire de la Majorité!"

type ChallengerGameState =
  | "C'est le moment de jouer"
  | "En attente des votes de la Majorité"
  | "Victoire du Champion!"
  | "Victoire de la Majorité!"

type GameState = MajorityGameState | ChallengerGameState

function isStateFinished(state: GameState) {
  return state == "Victoire du Champion!" || state == "Victoire de la Majorité!"
}

function getState(
  context: ReturnType<typeof useWebsocket>,
  game: Chess,
  playerType: "challenger" | "majority" | "spectator"
): GameState {
  const challengerColor =
    context.info.gameInfo?.settings.challengerColor == "white" ? "w" : "b"
  if (game && game.isGameOver()) {
    return game.turn() != challengerColor
      ? "Victoire du Champion!"
      : "Victoire de la Majorité!"
  }

  if (context.winner) {
    return context.winner == challengerColor
      ? "Victoire du Champion!"
      : "Victoire de la Majorité!"
  }

  if (playerType == "challenger" || playerType == "spectator") {
    if (game.turn() == challengerColor) {
      return "C'est le moment de jouer"
    } else {
      return "En attente des votes de la Majorité"
    }
  } else {
    if (game.turn() == challengerColor) {
      return "En attente du coup du Champion"
    } else {
      if (context.hasUserVoted) {
        return "En attente des autres votes"
      } else {
        return "C'est le moment du vote"
      }
    }
  }
}

function ContextDisplay({
  context,
  game,
  playerType,
}: {
  context: ReturnType<typeof useWebsocket>
  game?: Chess
  playerType: "challenger" | "majority" | "spectator"
}) {
  if (!game) {
    return <div>No game</div>
  }
  const state = getState(context, game, playerType)
  let objectStateElement: JSX.Element

  const pieceUrlChallenger =
    context.info.gameInfo?.settings.challengerColor == "white"
      ? "/piece-white.png"
      : "/piece-black.png"
  const pieceUrlMajority =
    context.info.gameInfo?.settings.challengerColor == "white"
      ? "/piece-black.png"
      : "/piece-white.png"

  const videoUrl = context.info.gameInfo?.settings.liveStreamUrl

  function Base(props: { children: ReactNode }) {
    if (!videoUrl) {
      return (
        <div className="relative flex h-[80px] items-center justify-center overflow-hidden rounded-sm border-2 border-[#48ADD7] bg-[#DFF6FF]">
          {props.children}
        </div>
      )
    }
    return (
      <div className="grid grid-cols-5 gap-2">
        <div className="relative col-span-4 flex h-[80px] items-center justify-center overflow-hidden rounded-sm border-2 border-[#48ADD7] bg-[#DFF6FF]">
          {props.children}
        </div>
        <a
          target="_blank"
          rel="noreferrer"
          href={videoUrl}
          className="flex items-center justify-center rounded-md bg-[#48ADD7] p-2 text-white hover:brightness-110"
        >
          <svg
            className="transition-all duration-200 hover:scale-110"
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 256 256"
          >
            <path
              fill="currentColor"
              d="M234.33 69.52a24 24 0 0 0-14.49-16.4C185.56 39.88 131 40 128 40s-57.56-.12-91.84 13.12a24 24 0 0 0-14.49 16.4C19.08 79.5 16 97.74 16 128s3.08 48.5 5.67 58.48a24 24 0 0 0 14.49 16.41C69 215.56 120.4 216 127.34 216h1.32c6.94 0 58.37-.44 91.18-13.11a24 24 0 0 0 14.49-16.41c2.59-10 5.67-28.22 5.67-58.48s-3.08-48.5-5.67-58.48m-73.74 65l-40 28A8 8 0 0 1 108 156v-56a8 8 0 0 1 12.59-6.55l40 28a8 8 0 0 1 0 13.1Z"
            />
          </svg>
        </a>
      </div>
    )
  }

  switch (state) {
    case "C'est le moment du vote":
      objectStateElement = (
        <Base>
          <span className="text-xl font-bold">C{"'"}est le moment du vote</span>
          <img src={pieceUrlMajority} className="h-[45px]" />
        </Base>
      )
      break
    case "En attente des autres votes":
      objectStateElement = (
        <Base>
          <span className="text-xl font-bold">
            En attente des autres votes...
          </span>
        </Base>
      )
      break
    case "En attente du coup du Champion":
      objectStateElement = (
        <Base>
          <span className="text-xl font-bold">
            En attente du coup du Champion...
          </span>
        </Base>
      )
      break
    case "Victoire du Champion!":
      objectStateElement = (
        <Base>
          <span className="text-xl font-bold">Victoire du Champion!</span>
          <img src={pieceUrlChallenger} className="h-[45px]" />
        </Base>
      )
      break
    case "Victoire de la Majorité!":
      objectStateElement = (
        <Base>
          <span className="text-xl font-bold">Victoire de la Majorité!</span>
          <img src={pieceUrlMajority} className="h-[45px]" />
        </Base>
      )
      break
    case "C'est le moment de jouer":
      objectStateElement = (
        <Base>
          <span className="text-xl font-bold">
            C{"'"}est le moment de jouer
          </span>
          <img
            src={
              playerType == "challenger" ? pieceUrlChallenger : pieceUrlMajority
            }
            className="h-[45px]"
          />
        </Base>
      )
      break
    case "En attente des votes de la Majorité":
      objectStateElement = (
        <Base>
          <span className="text-xl font-bold">
            En attente des votes de la Majorité
          </span>
          <img src={pieceUrlMajority} className="h-[45px]" />
        </Base>
      )
      break
    default:
      objectStateElement = <div>No State</div>
  }
  return objectStateElement
}

export function convertToFrenchNotation(san: string): string {
  const notationMap: { [key: string]: string } = {
    K: "R", // Roi
    Q: "D", // Dame
    R: "T", // Tour
    B: "F", // Fou
    N: "C", // Cavalier
    a: "a",
    b: "b",
    c: "c",
    d: "d",
    e: "e",
    f: "f",
    g: "g",
    h: "h",
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    x: "x",
    "+": "+",
    "#": "#",
    "=": "=",
  }

  return san
    .split("")
    .map((char) => notationMap[char] || char)
    .join("")
}

type VoteBySan = {
  moveSan: string
  percent: number
  isPlayerMove: boolean
}[]

export function VotesDisplay({
  votes,
  showMove,
  playerId,
}: {
  votes: GameProps["context"]["votes"]
  showMove: boolean
  playerId?: string
}) {
  // group votes by san into a sorted array of the form
  const groupedVotes = votes.reduce(
    (acc, vote) => {
      if (acc[vote.moveSan] == undefined) {
        acc[vote.moveSan] = 0
      }
      acc[vote.moveSan] += 1
      return acc
    },
    {} as Record<string, number>
  )

  let votesBySan: VoteBySan = []
  Object.entries(groupedVotes).forEach(([moveSan, count]) => {
    votesBySan.push({
      moveSan,
      percent: (count / votes.length) * 100,
      isPlayerMove: false,
    })
  })

  votesBySan.sort((a, b) => b.percent - a.percent)
  votesBySan = votesBySan.slice(0, 5)

  if (playerId) {
    const playerMove = votes.find((vote) => vote.playerId == playerId)
    if (playerMove) {
      votesBySan.forEach((vote) => {
        if (vote.moveSan == playerMove.moveSan) {
          vote.isPlayerMove = true
        }
      })
    }
  }

  if (votesBySan.length == 0) {
    return (
      <div className="relative flex flex-1 flex-col items-center justify-center gap-5 overflow-hidden rounded-sm border-2 border-zinc-200 p-3">
        <span className="text-xl text-zinc-300">
          Pas de votes pour le moment
        </span>
      </div>
    )
  }

  return (
    <div className="relative flex flex-1 flex-col gap-5 overflow-hidden rounded-sm border-2 border-zinc-200 p-3">
      <h2 className="tex-zinc-800 text-xl font-bold">
        {votes.length} {votes.length == 1 ? "Vote" : "Votes"}
      </h2>
      <div className="flex flex-col gap-6">
        {votesBySan.map((move) => (
          <div className="flex gap-4" key={move.moveSan}>
            {showMove ? (
              <div className="w-10 text-center font-bold text-zinc-700">
                {convertToFrenchNotation(move.moveSan)}
              </div>
            ) : (
              <div className="w-10 text-right font-bold text-zinc-700">
                {`${move.percent.toFixed(0)}%`}
              </div>
            )}

            <div className="flex-1 overflow-hidden rounded-full bg-[#DFF6FF] text-zinc-500">
              <div
                style={{
                  width: `${move.percent}%`,
                }}
                className={cn(
                  "h-full w-full bg-[#48ADD7] text-primary-foreground ring-offset-background transition-all duration-300",
                  move.isPlayerMove ? "bg-red-500" : "bg-[#48ADD7]"
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function getArrows(
  lastVotedCoords: { from: Square; to: Square } | null,
  context: GameProps["context"],
  game: Chess | undefined,
  playerType: GameProps["playerType"]
): [string, string][] {
  if (!game) return []

  const challengerColor =
    context.info.gameInfo?.settings.challengerColor == "white" ? "w" : "b"

  if (playerType == "challenger") {
    if (game?.turn() == challengerColor) {
      return context.lastMove
        ? [[context.lastMove.startSquare, context.lastMove.endSquare]]
        : []
    } else {
      return []
    }
  } else {
    if (game?.turn() == challengerColor) {
      return []
    } else {
      return lastVotedCoords
        ? [[lastVotedCoords.from, lastVotedCoords.to]]
        : context.lastUserVote
          ? [[context.lastUserVote.startSquare, context.lastUserVote.endSquare]]
          : []
    }
  }
}

export function MovesDisplay({ moves }: { moves: Move[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    containerRef.current?.scrollTo({
      top: containerRef.current?.scrollHeight,
      behavior: "smooth",
    })
  }
  const group: ([Move, Move] | [Move])[] = []

  for (let i = 0; i < moves.length; i += 2) {
    if (i + 1 == moves.length) {
      group.push([moves[i]])
    } else {
      group.push([moves[i], moves[i + 1]])
    }
  }

  function M1M2({
    m1,
    m2,
    isLast,
  }: {
    m1: Move
    m2: Move | undefined
    isLast: boolean
  }) {
    return (
      <>
        <div
          className={cn(
            "p-2 text-sm text-gray-700",
            isLast && !m2 ? "bg-zinc-100" : ""
          )}
        >
          {convertToFrenchNotation(m1.moveSan)}
        </div>
        <div
          className={cn(
            "p-2 text-sm text-gray-700",
            isLast && m2 ? "bg-zinc-100" : ""
          )}
        >
          {m2?.moveSan ? convertToFrenchNotation(m2?.moveSan) : ""}
        </div>
      </>
    )
  }

  useEffect(() => {
    scrollToBottom()
  }, [moves])

  if (moves.length == 0) {
    return (
      <div className="relative flex flex-1 flex-col items-center justify-center gap-5 overflow-hidden rounded-sm border-2 border-zinc-200 p-3">
        <span className="text-xl text-zinc-300">
          Pas de coups pour le moment
        </span>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex h-[100px] flex-col overflow-hidden overflow-y-auto rounded-sm border-2"
    >
      {group.map(([m1, m2], i) => (
        <div className="flex flex-col" key={i}>
          <div className="items-strech flex">
            <div className="flex w-[100px] items-center justify-center bg-zinc-200 text-center text-zinc-600">
              <span>{i + 1}</span>
            </div>
            <div className="grid w-full grid-cols-2 gap-2">
              <M1M2 m1={m1} m2={m2} isLast={i == group.length - 1} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function Game({ context, playerColor, playerType }: GameProps) {
  const [lastVotedCoords, setLastVotedCoords] = useState<{
    from: Square
    to: Square
  } | null>(null)
  const [game, setGame] = useState<Chess>()
  const [customSquareStyles, setCustomSquareStyles] =
    useState<CustomSquareStyles>({})
  const [vote, setVote] = useState<string>()

  useEffect(() => {
    setVote(undefined)
    if (typeof context.lastMove == "undefined") {
      return
    } else {
      setLastVotedCoords(null)
      setGame(new Chess(context.lastMove?.fen || undefined))
    }
  }, [context.lastMove])

  const [firstSquare, setFirstSquare] = useState<Square>()
  const [error, setError] = useState<string>("")

  function sendMove(
    moveSan: string,
    fen: string,
    startSquare: string,
    endSquare: string
  ) {
    setVote(moveSan)

    if (!context.send) {
      throw new Error("No send function")
    }
    if (!game) {
      throw new Error("No game")
    }
    if (!context.info.gameId) {
      throw new Error("No gameId")
    }
    if (!context.info.gameInfo) {
      throw new Error("No gameInfo")
    }
    if (playerType == "challenger") {
      context.send({
        type: "move",
        data: {
          fen: fen,
          moveSan: moveSan,
          color: context.info.gameInfo?.settings.challengerColor,
          gameId: context.info.gameId,
          moveNumber:
            context.lastMove == undefined ? 0 : context.lastMove.moveNumber + 1,
          startSquare,
          endSquare,
        },
      })
    } else {
      game.undo()
      if (!context.info.playerId) {
        throw new Error("No playerId")
      }
      context.send({
        type: "vote",
        data: {
          color:
            playerColor == "w" ? "white" : "black",
          fen: fen,
          moveSan: moveSan,
          playerId: context.info.playerId,
          gameId: context.info.gameId,
          moveNumber:
            context.lastMove == undefined ? 0 : context.lastMove.moveNumber + 1,
          startSquare,
          endSquare,
        },
      })
    }
  }

  const [pendingMove, setPendingMove] = useState<
    [string, string, string, string] | null
  >(null)

  const [openConfirmMoveModal, setOpenConfirmMoveModal] = useState(false)

  function selectSecondSquare(square: Square) {
    if (!game) {
      throw new Error("No game")
    }

    if (!firstSquare) {
      throw new Error("No first square")
    }
    // if new selected square is color of player, set as first square
    if (game.get(square)?.color == playerColor) {
      // set custom square styles for possible moves
      const moves = game.moves({ square, verbose: true })
      const styles: CustomSquareStyles = {}
      moves.forEach((move) => {
        styles[move.to] = {
          backgroundColor: "rgba(255, 255, 0, 0.4)",
        }
      })
      setCustomSquareStyles(styles)
      setFirstSquare(square)

      return
    }

    try {
      const move = game.move({
        from: firstSquare,
        to: square,
        promotion: "q",
      })

      if (playerType == "challenger") {
        sendMove(move.san, game.fen(), move.from, move.to)
      } else {
        setPendingMove([move.san, game.fen(), move.from, move.to])
        game.undo()
        setOpenConfirmMoveModal(true)
      }
      setLastVotedCoords({ from: firstSquare, to: square })
      setFirstSquare(undefined)
      setCustomSquareStyles({})
    } catch (e) {
      setError("Coup invalide")
    }
  }

  function selectFirstSquare(square: Square) {
    if (!game) {
      throw new Error("No game")
    }
    console.log("first square", square)
    if (game.get(square) == null) {
      console.log("no piece")
      return
    }
    if (game.turn() != playerColor) {
      console.log("not your turn")
      return
    }
    // set custom square styles for possible moves
    const moves = game.moves({ square, verbose: true })
    const styles: CustomSquareStyles = {}
    moves.forEach((move) => {
      styles[move.to] = {
        backgroundColor: "rgba(255, 255, 0, 0.4)",
      }
    })
    setCustomSquareStyles(styles)
    console.log("in select first squre, setting first squre", square)
    setFirstSquare(square)
  }

  const onSquareClick: (square: Square) => void = (square) => {
    console.log("onSquareClick", square)
    if (playerType == "spectator" || context.winner) return
    if (!game) {
      throw new Error("No game")
    }

    if (vote || context.hasUserVoted) {
      console.log("already voted")
      return
    }

    setError("")
    if (firstSquare) {
      selectSecondSquare(square)
    } else {
      selectFirstSquare(square)
    }
  }

  useEffect(() => {
    console.log("change in firstSquare", firstSquare)
  }, [firstSquare])

  function onPieceDragBegin(piece: Piece, sourceSquare: Square) {
    console.log("onPieceDragBegin", piece, sourceSquare)
    selectFirstSquare(sourceSquare)
  }
  const onPieceDrop: (
    sourceSquare: Square,
    targetSquare: Square,
    piece: Piece
  ) => boolean = (sourceSquare, targetSquare, piece) => {
    console.log("onPieceDrop", sourceSquare, targetSquare, piece)
    // console.log("firstSquare", firstSquare)
    selectSecondSquare(targetSquare)
    return false
  }

  const isDraggablePiece: (args: {
    piece: Piece
    sourceSquare: Square
  }) => boolean = (args) => {
    if (playerType == "spectator") return false
    if (context.winner) return false
    if (!game) {
      return false
    }

    if (vote || context.hasUserVoted) {
      return false
    }

    const challengerColor =
      context.info.gameInfo?.settings.challengerColor == "black" ? "b" : "w"
    const userColor = playerColor

    const isUserTurn = game.turn() == userColor
    if (!isUserTurn) {
      return false
    }

    if (playerType == "challenger") {
      return args.piece.includes(challengerColor)
    } else {
      return !args.piece.includes(challengerColor)
    }
  }
  const customArrows = getArrows(
    lastVotedCoords,
    context,
    game,
    playerType
  ) as [Square, Square][]

  function confirmMove() {
    if (pendingMove == null) return
    const [moveSan, fen, startSquare, endSquare] = pendingMove
    sendMove(moveSan, fen, startSquare, endSquare)
    setOpenConfirmMoveModal(false)
  }

  function cancelMove() {
    setOpenConfirmMoveModal(false)
    setPendingMove(null)
    setLastVotedCoords(null)
  }

  let state: GameState | undefined
  if (game) {
    state = getState(context, game, playerType)
  }

  function getPercentageOfSelectedPlayerVote(
    context: ReturnType<typeof useWebsocket>
  ) {
    if (!context.votes || !Array.isArray(context.votes)) {
      return 0
    }

    // make an array with for each move number the vote of the player and the played move
    const arr: {
      moveNumber: number
      playerMoveSan: string
      selectedMoveSan: string
    }[] = []
    for (let i = 0; i < context.moves.length; i++) {
      const selectedMove = context.moves[i]
      const moveColor = selectedMove.color
      const challengerColor = context.info.gameInfo?.settings.challengerColor
      if (moveColor == challengerColor) continue

      const playerMove: Move | undefined = context.allUserVotes.find(
        (v) => v.moveNumber == selectedMove.moveNumber
      )

      arr.push({
        moveNumber: selectedMove.moveNumber,
        selectedMoveSan: selectedMove.moveSan,
        playerMoveSan: playerMove?.moveSan || "NO",
      })
    }
    for (let i = 0; i < context.votes.length; i++) {
      const vote = context.votes[i]
      if (!arr[vote.moveNumber]) continue
      arr[vote.moveNumber].playerMoveSan = vote.moveSan
    }
    // count number of item where playerMoveSan == selectedMoveSan
    const numberOfSelectedPlayerVote = arr.filter(
      (item) => item.playerMoveSan == item.selectedMoveSan
    ).length
    const totalNumberOfMoves = context.moves.filter(
      (v) => v.color != context.info.gameInfo?.settings.challengerColor
    ).length
    return (numberOfSelectedPlayerVote / totalNumberOfMoves) * 100
  }

  const percentageOfSelectedPlayerVote = getPercentageOfSelectedPlayerVote(
    context
  )

  return (
    <div className="mx-16 my-4">
      <Dialog.Root open={openConfirmMoveModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
            <div>
              <div>
                <div className="pb-5 text-lg font-semibold leading-none tracking-tight">
                  Vous avez joué le coup{" "}
                  {pendingMove == null
                    ? "null"
                    : convertToFrenchNotation(pendingMove[0])}
                  , êtes vous sûr ?
                </div>
              </div>
              <div className="grid w-full grid-cols-2 gap-2 pb-2">
                <Button variant="outline" onClick={cancelMove}>
                  Annuler
                </Button>
                <Button onClick={confirmMove}>Jouer le coup</Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="flex flex-1 justify-center gap-4">
        <h1 className="mb-5 text-center text-2xl font-bold 2xl:text-3xl">
          {context.info.gameInfo?.name}
        </h1>
      </div>

      {error.length > 0 && (
        <div className="flex justify-center py-2">
          <div className="rounded bg-red-200 p-2 text-red-700">{error}</div>
        </div>
      )}

      <div className="flex flex-1 justify-center gap-4">
        <div className=" ">
          {game && state && (
            <div>
              {context.lastMove && (
                <div className="w-[500px] pb-2 2xl:w-[800px]">
                  {isStateFinished(state) ? (
                    <LockCountdown />
                  ) : (
                    <Countdown
                      key={context.lastMove?.id}
                      renderer={getTimeRenderer(
                        context.info.gameInfo?.settings.majorityTime! * 1000
                      )}
                      date={
                        new Date(context.lastMove?.createdAt).getTime() +
                        context.info.gameInfo?.settings.majorityTime! * 1000
                      }
                    />
                  )}
                </div>
              )}
              <div className="relative w-[500px] overflow-hidden rounded-sm 2xl:w-[800px]">
                {context.hasUserVoted && (
                  <div className="absolute inset-0 top-0 z-50 flex items-center justify-center bg-black/70 text-center text-4xl font-bold text-white">
                    <span>
                      Vous avez voté <br />
                      {pendingMove == null
                        ? ""
                        : convertToFrenchNotation(pendingMove[0])}
                    </span>
                  </div>
                )}

                <Board
                  boardOrientation={playerColor == "w" ? "white" : "black"}
                  position={game.fen()}
                  customSquareStyles={customSquareStyles}
                  customArrows={customArrows}
                  onSquareClick={onSquareClick}
                  onPieceDragBegin={onPieceDragBegin}
                  isDraggablePiece={isDraggablePiece}
                  onPieceDrop={onPieceDrop}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex w-[400px] flex-col gap-4">
          {state && (
            <>
              <ContextDisplay
                context={context}
                game={game}
                playerType={playerType}
              />
              <MovesDisplay moves={context.moves} />
              {isStateFinished(state) ? (
                <div className="relative flex flex-1 flex-col items-center justify-center gap-5 overflow-hidden rounded-sm border-2 border-zinc-200 p-3">
                  {playerType == "majority" && (
                    <p className="p-2 text-center text-zinc-500">
                      Les coups que vous avez choisis ont été sélectionnés{" "}
                      <span className="font-bold text-zinc-700">
                        {percentageOfSelectedPlayerVote.toFixed(0)}%
                      </span>{" "}
                      du temps
                    </p>
                  )}
                  <p className="p-2 text-center text-zinc-500">
                    Merci d{"'"}avoir participé à cette Partie Majoritaire !
                    <br />
                    Cliquez ci-dessous pour accéder au replay
                  </p>
                  <Link href={`/game/${context.info.gameId}/replay`}>
                    Voir le replay
                  </Link>
                </div>
              ) : (
                <VotesDisplay
                  playerId={context.info.playerId!}
                  votes={context.votes}
                  showMove={
                    state == "En attente des autres votes" ||
                    state == "En attente du coup du Champion"
                  }
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
