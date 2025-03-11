import Image from "next/image"

import TwoSide from "@/components/two-side"
import { GameForm } from "./game-form"

export default function Page() {
  return (
    <TwoSide>
      <div className="p-12">
        <Image src="/logo-piece.png" alt="logo" width={50} height={50} />
        <h1 className="mb-4 text-4xl font-bold">Création de partie</h1>
        <GameForm />
      </div>
    </TwoSide>
  )
}
