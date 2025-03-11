import TwoSide from "@/components/two-side"
import { InputOTPForm } from "./form"

export default function VerifyPage() {
  return (
    <TwoSide>
      <div className="p-16">
        <h1 className="my-2 text-3xl font-bold">Vérifier votre compte</h1>
        <InputOTPForm />
      </div>
    </TwoSide>
  )
}
