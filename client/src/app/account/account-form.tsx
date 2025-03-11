"use client"

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
import { LuciaUser } from "../../../../server/src/auth/lucia"
import { useContextUser } from "../context"

// import { FormDataSchema } from "@/lib/schema"

const FormDataSchema = z.object({
  userInfo: z.union([
    z.object({
      username: z.string().min(2, {
        message: "Le nom d'utilisateur doit contenir au moins 2 caractères.",
      }),
      isSchool: z.literal(true),
      schoolName: z.string().min(6, {
        message: "Le nom d'établissement doit contenir au moins 6 caractères.",
      }),
      schoolUAICode: z.string().optional(),
      schoolZipCode: z.string().optional(),
    }),
    z.object({
      username: z.string().min(2, {
        message: "Le nom d'utilisateur doit contenir au moins 2 caractères.",
      }),
      isSchool: z.literal(false),
    }),
  ]),
})
type Inputs = z.infer<typeof FormDataSchema>

export function AccountForm({ user }: { user: LuciaUser | undefined | null }) {
  const userContext = useContextUser()
  const router = useRouter()

  const form = useForm<z.infer<typeof FormDataSchema>>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      userInfo: {
        username: user?.userInfo.username,
        isSchool: user?.userInfo.isSchool,
        schoolName: user?.userInfo.isSchool ? user?.userInfo.schoolName : "",
        schoolUAICode: user?.userInfo.isSchool
          ? user?.userInfo.schoolUAICode
          : "",
        schoolZipCode: user?.userInfo.isSchool
          ? user?.userInfo.schoolZipCode
          : "",
      },
    },
  })

  const processForm: SubmitHandler<Inputs> = async (values) => {
    console.log("SEND", values)

    const res = await apiClient.users.patch({
      userInfo: values.userInfo,
    })
    console.log(res)
    if (res.status !== 200) {
      console.log("Res is different from 200", res.status)
      if (res.status == 400) {
        console.log("res is 400")
      } else {
        throw new Error(JSON.stringify(res))
      }
    } else {
      console.log("success")
      userContext.refetch()
      router.refresh()
    }
  }

  type FieldName = keyof Inputs

  if (!user) {
    return <div>Loading...</div>
  }

  //   const prev = () => {
  //     if (currentStep > 0) {
  //       setPreviousStep(currentStep)
  //       setCurrentStep((step) => step - 1)
  //     }
  //   }

  return (
    <section className="flex w-full flex-col justify-between">
      <Form {...form}>
        {/* Form */}
        {form.formState.errors.root && (
          <div className="text-sm text-red-500">
            {form.formState.errors.root.message}
          </div>
        )}

        <form className="" onSubmit={form.handleSubmit(processForm)}>
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

          {form.getValues("userInfo.isSchool") === true && (
            <div className="mt-3 space-y-4">
              <FormField
                control={form.control}
                name="userInfo.schoolName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Nom de l{"'"}établissement</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Votre nom d'établissement"
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
          <Button
            disabled={form.formState.isSubmitting}
            className="mt-4 w-full"
            type="submit"
          >
            {form.formState.isSubmitting
              ? "Enregistrement en cours..."
              : "Mettre à jour mon profil"}
          </Button>
        </form>
      </Form>
    </section>
  )
}
