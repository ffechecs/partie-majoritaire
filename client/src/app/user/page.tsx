"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { CheckIcon, CopyIcon } from "lucide-react"

import { apiClient } from "@/lib/eden"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
  const { data, refetch } = useQuery(["users"], () => apiClient.users.get())

  const users = data?.data

  if (!users) {
    return <div>Loading...</div>
  }
  // sorted based on role and then on createdAt
  const sortedUser = users?.sort((a, b) => {
    if (a.role != b.role) {
      const orders = ["superadmin", "admin", "user"]
      return orders.indexOf(a.role) - orders.indexOf(b.role)
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })

  return (
    <div className="mx-auto mt-16 w-full max-w-4xl">
      <div className="flex w-full flex-col justify-center">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Utilisateurs</h1>
            <span>
              ({users.length} utilisateur{users.length > 1 ? "s" : ""})
            </span>
          </div>
        </div>
        {users.length == 0 ? (
          <div className="my-8 rounded-sm border bg-zinc-100 p-10 text-center">
            Pas d{"'"}utilisateur pour le moment
          </div>
        ) : (
          <div className="my-8 rounded-sm border">
            <Table className="">
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Compte École</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUser.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>{user.userInfo.username}</div>
                      <div className="text-xs text-zinc-500">
                        {new Date(user.createdAt).toLocaleString("fr")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{user.email}</div>
                    </TableCell>
                    <TableCell>
                      <Select
                        disabled={user.role == "superadmin"}
                        defaultValue={user.role}
                        onValueChange={async (e) => {
                          const role = e as "user" | "admin" | "superadmin"
                          const res = await apiClient.users[user.id].patch({
                            role,
                          })
                          if (res.status !== 200) {
                            console.log("error", res)
                          }
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          {user.role == "superadmin" && (
                            <SelectItem disabled value="superadmin">
                              SuperAdmin
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {user.userInfo.isSchool ? (
                        <div className="flex items-center">
                          <ul>
                            <li>
                              Nom d{"'"}établissement :{" "}
                              {user.userInfo.schoolName}
                            </li>
                            <li>
                              Code d{"'"}établissement :{" "}
                              {user.userInfo.schoolUAICode ?? (
                                <span className="text-zinc-400">
                                  Non renseigné
                                </span>
                              )}
                            </li>
                            <li>
                              Code postal :{" "}
                              {user.userInfo.schoolZipCode ?? (
                                <span className="text-zinc-400">
                                  Non renseigné
                                </span>
                              )}
                            </li>
                          </ul>
                        </div>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    {/* <TableCell> */}
                    {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
                    {/* </TableCell> */}
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
