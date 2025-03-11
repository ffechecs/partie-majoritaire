"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
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
import { Switch } from "@/components/ui/switch"

// import { FormDataSchema } from "@/lib/schema"

const FormDataSchema = z.object({
  // username: z.string().min(2, {
  //   message: "Nom d'utilisateur doit être au moins 2 caractères.",
  // }),
  email: z.string().email({
    message: "Addresse e-mail invalide",
  }),
  userInfo: z.union([
    z.object({
      username: z.string().min(2, {
        message: "Nom d'utilisateur doit être au moins 2 caractères.",
      }),
      isSchool: z.literal(true),
      schoolName: z.string().min(6, {
        message: "Nom de l'établissement doit être au moins 6 caractères.",
      }),
      schoolUAICode: z.string().optional(),
      schoolZipCode: z.string().optional(),
    }),
    z.object({
      username: z.string().min(2, {
        message: "Nom d'utilisateur doit être au moins 2 caractères.",
      }),
      isSchool: z.literal(false),
    }),
  ]),
})
type Inputs = z.infer<typeof FormDataSchema>

const steps = [
  {
    id: "Step 1",
    name: "Base Information",
    fields: ["email", "username", "isSchool"],
  },
  {
    id: "Step 2",
    name: "School Information",
    fields: ["schoolName", "schoolUAICode", "schoolZipCode"],
  },
]

export function SignUpForm() {
  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const delta = currentStep - previousStep
  const router = useRouter()

  const form = useForm<z.infer<typeof FormDataSchema>>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      // username: "",
      email: "",
      userInfo: {
        isSchool: false,
      },
    },
  })

  const processForm: SubmitHandler<Inputs> = async (values) => {
    console.log("SEND", values)

    const res = await apiClient.auth["sign-up"].post({
      email: values.email,
      userInfo: values.userInfo,
    })
    console.log(res)
    if (res.status !== 200) {
      console.log("Res is different from 200", res.status)
      if (res.status == 400) {
        console.log("res is 400")
        form.setError("root", {
          message: "Adresse e-mail déjà existante",
        })
      } else {
        throw new Error(JSON.stringify(res))
      }
    } else {
      console.log("success")
      router.push("/auth/verify")
    }
  }

  type FieldName = keyof Inputs

  const next = async () => {
    const fields = steps[currentStep].fields
    const output = await form.trigger(fields as FieldName[], {
      shouldFocus: true,
    })

    if (!output) return

    console.log("HERE", form.getValues("userInfo.isSchool"))
    if (form.getValues("userInfo.isSchool") == false) {
      await form.handleSubmit(processForm)()
      return
    }
    if (currentStep === steps.length - 1) {
      await form.handleSubmit(processForm)()
      return
    }
    setPreviousStep(currentStep)
    setCurrentStep((step) => step + 1)
  }

  //   const prev = () => {
  //     if (currentStep > 0) {
  //       setPreviousStep(currentStep)
  //       setCurrentStep((step) => step - 1)
  //     }
  //   }

  return (
    <section className="flex flex-col justify-between">
      <Form {...form}>
        {/* Form */}
        {form.formState.errors.root && (
          <div className="text-sm text-red-500">
            {form.formState.errors.root.message}
          </div>
        )}

        <form className="" onSubmit={form.handleSubmit(processForm)}>
          {currentStep === 0 && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="userInfo.username"
                render={({ field, fieldState, formState }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                Votre adresse email ne sera pas partagée.
              </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <div className="pt-3">
                <FormField
                  control={form.control}
                  name="userInfo.isSchool"
                  render={({ field, fieldState, formState }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>
                          Représentez-vous un établissement scolaire ?
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="userInfo.schoolName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Nom de l{"'"}établissement</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Votre de l'établissement"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userInfo.schoolZipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Code postal de l{"'"}établissement{" "}
                      <span className="text-sm font-normal text-zinc-500">
                        (optionnel)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Votre code postal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userInfo.schoolUAICode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Code UAI de l{"'"}établissement{" "}
                      <span className="text-sm font-normal text-zinc-500">
                        (optionnel)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Votre code UAI" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </form>
      </Form>

      <div className="mt-4">
        <div className="flex justify-between">
          <Button onClick={next}>Continuer</Button>
        </div>
      </div>
    </section>
  )
}
