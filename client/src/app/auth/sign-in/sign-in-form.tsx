"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { apiClient } from "@/lib/eden"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  // username: z.string().min(2, {
  //   message: "Nom d'utilisateur doit être au moins 2 caractères.",
  // }),
  email: z.string().email({
    message: "Adresse e-mail invalide",
  }),
})

export function SignInForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // username: "",
      email: "",
    },
  })
  const router = useRouter()

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    const res = await apiClient.auth["sign-in"].post({
      email: values.email,
    })
    if (res.status != 200) {
      form.setError("root", {
        message: "Compte non existant, veuillez vous inscrire",
      })
    } else {
      console.log(res.status)
      console.log("success")
      console.log(res.data)
      router.push("/auth/verify")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {form.formState.errors.root && (
          <div className="text-sm text-red-500">
            {form.formState.errors.root.message}
          </div>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse E-mail</FormLabel>
              <FormControl>
                <Input placeholder="Votre adresse e-mail" {...field} />
              </FormControl>
              {/* <FormDescription>
                Votre adresse email ne sera pas partagée.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Se connecter</Button>
      </form>
    </Form>
  )
}

// <FormField
//   control={form.control}
//   name="username"
//   render={({ field }) => (
//     <FormItem>
//       <FormLabel>Nom d'utilisateur</FormLabel>
//       <FormControl>
//         <Input placeholder="Nom d'utilisateur" {...field} />
//       </FormControl>
//       {/* <FormDescription>
//         Votre nom d'utilisateur sera public.
//       </FormDescription> */}
//       <FormMessage />
//     </FormItem>
//   )}
// />
