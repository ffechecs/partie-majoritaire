"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

import { apiClient } from "@/lib/eden"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const enterCodeText = `Vous avez reçu un identifiant de partie pour rejoindre une partie ?
Entrez-le ici pour rejoindre la partie. Si vous n'avez pas de code, vous pouvez
demander à l'organisateur de la partie.`

export default function Page() {
  const [code, setCode] = useState<string>("")
  const [error, setError] = useState<string>("")
  const router = useRouter()

  async function joinGameWithCode(value: string) {
    const res = await apiClient.games.code[value].get()
    console.log(res)
    if (res.error) return console.error(res.error)

    if (!res.data) {
      setError(
        "Aucune partie n'existe avec l'identifiant suivant. Assurez-vous d'avoir saisi le bon identifiant"
      )
      return
    }

    if (value == res.data?.majorityCode) {
      router.push(`/game/${res.data?.id}/majority`)
    } else {
      router.push(`/game/${res.data?.id}/challenger`)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-5 pt-16">
      <h1 className="text-center text-3xl font-bold text-zinc-900">
        Entrez l{"'"}identifiant de partie pour pouvoir rejoindre
      </h1>
      <p className="w-[400px] pb-5 text-center text-sm text-zinc-500">
        {enterCodeText}
      </p>

      <InputOTP
        value={code}
        onChange={(newValue) => {
          setCode(newValue.toUpperCase())
        }}
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        maxLength={4}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
      {error ? (
        <div className="max-w-[400px] rounded-sm border-2 border-red-500 bg-red-100 p-2 text-center text-red-500">
          <span>{error}</span>
        </div>
      ) : null}
      <Button onClick={() => joinGameWithCode(code)}>Rejoindre</Button>
    </div>
  )
}
