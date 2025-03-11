import Image from "next/image"
import Link from "next/link"

import TwoSide from "@/components/two-side"
import { SignUpForm } from "./sign-up-form"

export default function SignUpPage() {
  return (
    <TwoSide>
      <div className="p-16">
        <Image src="/logo-piece.png" alt="logo" width={50} height={50} />
        <h1 className="mb-2 mt-2 text-3xl font-bold">Créer votre compte</h1>

        <p className="mb-5 text-gray-500">
          Si vous possédez déjà un compte,{" "}
          <Link
            className="text-blue-500 underline hover:text-blue-400"
            href="/auth/sign-in"
          >
            connectez vous
          </Link>
        </p>
        <SignUpForm />
      </div>
    </TwoSide>
  )
}
