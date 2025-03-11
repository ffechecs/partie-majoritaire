"use client"

import { useState } from "react"
import NextLink from "next/link"
import { useQuery } from "@tanstack/react-query"
import {
  CheckIcon,
  CirclePlayIcon,
  CopyIcon,
  EditIcon,
  EllipsisVertical,
  EyeIcon,
  TrashIcon,
} from "lucide-react"

import { apiClient } from "@/lib/eden"
import { Link } from "@/components/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useContextUser } from "../context"

export function CopyButton({ value }: { value: string }) {
  const [showCheckIcon, setShowCheckIcon] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setShowCheckIcon(true)
    setTimeout(() => {
      setShowCheckIcon(false)
    }, 500)
  }

  return (
    <Button variant="outline" size="icon" onClick={handleCopy} className="ml-2">
      {showCheckIcon ? (
        <CheckIcon width={16} height={16} />
      ) : (
        <CopyIcon width={16} height={16} />
      )}
    </Button>
  )
}
export default function Page() {
  const { data, refetch } = useQuery(["games"], () => apiClient.games.get())
  const { user } = useContextUser()

  const games = data?.data

  if (!games) {
    return <div>Loading...</div>
  }

  // return <pre>{JSON.stringify(games, null, 2)}</pre>

  return (
    <div className="mx-auto mt-16 w-full max-w-4xl">
      <div className="flex w-full flex-col justify-center">
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-2">
            <h1 className="text-4xl font-bold">Parties</h1>
            {user?.role == "superadmin" ? (
              <span className="text-lg font-normal text-zinc-400">
                (Vue superadministrateur)
              </span>
            ) : null}
          </div>

          <Link href="/game/create">Créer une partie</Link>
        </div>
        {games.length == 0 ? (
          <div className="my-8 rounded-sm border bg-zinc-100 p-10 text-center">
            Pas de partie pour le moment, créer une partie pour commencer !
          </div>
        ) : (
          <div className="my-8 rounded-sm border">
            <Table className="">
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  {user?.role == "superadmin" ? (
                    <TableHead>Créateur</TableHead>
                  ) : null}
                  <TableHead>Code majorité</TableHead>
                  <TableHead>Code champion</TableHead>
                  {user?.role == "superadmin" ? null : (
                    <TableHead className="w-[100px]">Rejoindre</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {games.map((game) => (
                  <TableRow key={game.games.id}>
                    <TableCell>
                      <div>
                        {game.games.name}
                        {game.games.settings.isGameForSchools ? (
                          <>
                            {" "}
                            <span className="text-sm text-zinc-500">
                              (Partie pour établissements scolaires)
                            </span>
                          </>
                        ) : null}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {new Date(game.games.createdAt).toLocaleString("fr")}
                      </div>
                    </TableCell>
                    {user?.role == "superadmin" ? (
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="">
                            {game.user.userInfo.username}
                          </span>
                          {/* <span
                            className="
                            text-sm
                            text-zinc-400 
                          "
                          >
                            {game.user.email}
                          </span> */}
                        </div>
                      </TableCell>
                    ) : null}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">
                          {game.games.majorityCode}
                        </span>
                        <CopyButton value={game.games.majorityCode} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">
                          {game.games.challengerCode}
                        </span>
                        <CopyButton value={game.games.challengerCode} />
                      </div>
                    </TableCell>
                    {user?.role == "superadmin" ? null : (
                      <TableCell>
                        <div className="flex gap-2">
                          <Link href={`/game/${game.games.id}/majority`}>
                            Majorité
                          </Link>
                          <Link
                            variant="outline"
                            href={`/game/${game.games.id}/challenger`}
                          >
                            Champion
                          </Link>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <DropdownMenu
                      // open={game.games.name == "Seconde partie"}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="outline">
                            <EllipsisVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <NextLink
                              className="flex w-full items-center gap-3"
                              href={`/game/${game.games.id}/spectator`}
                            >
                              <EyeIcon className="h-5 w-5" />
                              Spectateur
                            </NextLink>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <NextLink
                              className="flex w-full items-center gap-3"
                              href={`/game/${game.games.id}/replay`}
                            >
                              <CirclePlayIcon className="h-5 w-5" />
                              Replay
                            </NextLink>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <NextLink
                              className="flex w-full items-center gap-3"
                              href={`/game/${game.games.id}`}
                            >
                              <EditIcon className="h-5 w-5" />
                              Modifier
                            </NextLink>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <button
                              onClick={async () => {
                                await apiClient.games[game.games.id].delete()
                                await refetch()
                              }}
                              className="flex w-full items-center gap-3 text-red-500"
                            >
                              <TrashIcon className="h-5 w-5" />
                              Supprimer
                            </button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
