"use client"

import { useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { apiClient } from "@/lib/eden"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

// import { toast } from "@/components/ui/use-toast"

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Votre code doit contenir 6 caractères",
  }),
})

export function InputOTPForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const formRef = useRef<HTMLFormElement>(null)

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("onSubmit", data)
    formRef.current?.submit()

    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // })

    // const res = await apiClient.auth.verify.post({
    //   code: data.pin,
    // })
    // console.log(res.status)
    // console.log("success")
    // console.log(res.data)
    // router.push("/")
  }

  const isError = searchParams.has("error")

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        action="/api/auth/verify"
        method="post"
        className="w-2/3 space-y-6"
      >
        {isError && (
          <div className="relative flex flex-col rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            <strong className="font-bold">Erreur</strong>
            <span className="block sm:inline">
              Code invalide, veuillez contacter le support
            </span>
          </div>
        )}
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vérification par code unique</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Saisissez le mot de passe à usage unique envoyé sur votre
                adresse email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Continuer</Button>
      </form>
    </Form>
  )
}
