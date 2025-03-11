"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Game } from "@/types/eden"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

const ACTIVATE_ALL_TIME_IN_DEV: boolean = true

const possiblesTimes =
  !ACTIVATE_ALL_TIME_IN_DEV || process.env.NODE_ENV == "production"
    ? [
        {
          label: "10 secondes",
          value: "10",
        },
        {
          label: "1 minute",
          value: "60",
        },
        {
          label: "2 minutes",
          value: "120",
        },
        {
          label: "3 minutes",
          value: "180",
        },
        {
          label: "4 minutes",
          value: "240",
        },
        {
          label: "5 minutes",
          value: "300",
        },
      ]
    : [
        {
          label: "10 secondes",
          value: "10",
        },
        {
          label: "20 secondes",
          value: "20",
        },
        {
          label: "30 secondes",
          value: "30",
        },
        {
          label: "1 minute",
          value: "60",
        },
        {
          label: "2 minutes",
          value: "120",
        },
        {
          label: "3 minutes",
          value: "180",
        },
        {
          label: "4 minutes",
          value: "240",
        },
        {
          label: "5 minutes",
          value: "300",
        },
      ]

const possibleTimesValues = possiblesTimes.map((t) => t.value) as [
  string,
  ...string[],
]

const formSchema = z.object({
  name: z.string().min(2),
  challengerColor: z.enum(["black", "white"]),
  majorityTime: z.enum(possibleTimesValues),
  challengerTime: z.enum(possibleTimesValues),
  isGameForSchools: z.boolean(),
  liveStreamUrl: z.string().url().optional(),
})

export function EditForm(props: { game: Game; refetch: () => void }) {
  const router = useRouter()
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.game.name,
      challengerColor: props.game.settings.challengerColor,
      majorityTime: props.game.settings.majorityTime.toString(),
      challengerTime: props.game.settings.challengerTime.toString(),
      isGameForSchools: props.game.settings.isGameForSchools,
      liveStreamUrl: props.game.settings.liveStreamUrl
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    const res = await apiClient.games.patch({
      id: props.game.id,
      name: values.name,
      settings: {
        challengerColor: values.challengerColor,
        majorityTime: parseInt(values.majorityTime),
        challengerTime: parseInt(values.challengerTime),
        isGameForSchools: values.isGameForSchools,
        liveStreamUrl: values.liveStreamUrl,
      },
    })
    // router.refresh()
    if (res.data) props.refetch()
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom public de la partie</FormLabel>
              <FormControl>
                <Input placeholder="Partie Majoritaire ..." {...field} />
              </FormControl>
              {/* <FormDescription>Nom public de la partie</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="liveStreamUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                URl du direct vidéo{" "}
                <span className="text-sm font-normal text-zinc-500">
                  (optionnel)
                </span>
              </FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isGameForSchools"
          render={({ field, fieldState, formState }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>
                  La partie est-elle organisée pour des établissements scolaires
                  ?
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
        {/* <FormField
          control={form.control}
          name="challengerColor"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Couleur du champion</FormLabel>
              <FormControl>
              <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
              >
              <FormItem className="flex items-center space-x-3 space-y-0">
              <FormControl>
              <RadioGroupItem value="white" />
              </FormControl>
              <FormLabel className="font-normal">Blancs</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
              <FormControl>
              <RadioGroupItem disabled={true} value="black" />
              </FormControl>
              <FormLabel className="font-normal text-zinc-500">
                      Noirs (à venir)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
              </FormItem>
              )}
            /> */}
        <div className="grid grid-cols-2">
          <FormField
            control={form.control}
            name="majorityTime"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Temps de vote pour la majorité</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {possiblesTimes.map((t) => (
                      <FormItem
                        key={t.value}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={t.value} />
                        </FormControl>
                        <FormLabel className="font-normal">{t.label}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="challengerTime"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Temps de vote pour le champion</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {possiblesTimes.map((t) => (
                      <FormItem
                        key={t.value}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={t.value} />
                        </FormControl>
                        <FormLabel className="font-normal">{t.label}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="rounded-lg border-blue-500 bg-blue-100 p-4 text-blue-600">
          <span className="">
            <strong>Règles de la partie</strong>
          </span>
          <p className="mt-2 text-sm">
            Le Champion commencera avec les blancs et donnera le coup d{"'"}
            envoi de la partie. Si le champion joue avant son temps imparti, le
            coup sera joué directement. Alors que le coup de la majorité se sera
            joué qu{"'"}une fois le temps écoulé.
          </p>
        </div>
        <Button type="submit">Modifier la partie</Button>
      </form>
    </Form>
  )
}
