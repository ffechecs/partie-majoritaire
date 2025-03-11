/* eslint-disable @next/next/no-img-element */
import Image from "next/image"

import { Footer } from "@/components/footer"
import { Link } from "@/components/link"
import { Button } from "@/components/ui/button"

const howItWorksText = `
Partie Majoritaire est une plateforme mise à disposition
gratuitement par la Fédération Française des Échecs, destinée aux
clubs d'échecs, aux ligues régionales et aux comités
départementaux du jeu d'échecs dans le cadre du programme
Class'échecs. Ce site offre la possibilité aux différents acteurs
échiquéens la possibilité de disputer des parties contre des
champions régionaux ou nationaux de notre sport, en impliquant les
joueurs d’un territoire.`

export default function Page() {
  return (
    <>
      <div className="item-center mx-auto flex max-w-4xl flex-1 flex-col justify-center px-4 pb-12 pt-12 md:-mt-14 md:min-h-screen md:px-0 md:pb-0 md:pt-0 2xl:max-w-5xl">
        <div className="grid flex-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col justify-center gap-2">
            <Image
              width={300}
              height={200}
              src="/logo/partie-majoritaire.svg"
              className="w-[300px] 2xl:w-[450px]"
              alt="Logo de Partie Majoritaire"
            />
            <h1 className="text-primary-950 w-full text-xl font-bold 2xl:text-2xl">
              Bienvenue sur la plateforme de Partie Majoritaire
            </h1>
            <div className="mt-4">
              <Link variant="default" size="lg" href="/game/join">
                Rejoindre une partie
              </Link>
            </div>
          </div>
          <div className="hidden h-full items-center justify-end md:flex">
            <div className="relative mt-4 h-[600px] w-[400px] overflow-hidden rounded-xl shadow-xl shadow-primary/20 2xl:h-[800px] 2xl:w-[600px]">
              <img
                src="/bg.jpg"
                alt="bg"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-8 bg-blue-ribbon-600 px-4 md:px-0">
        <div className="mx-auto flex max-w-4xl items-center gap-16 py-16 2xl:max-w-5xl">
          <div>
            <h2 className="pb-2 text-2xl font-bold text-zinc-50">
              Comment ça marche ?
            </h2>
            <p className="text-blue-ribbon-100">{howItWorksText}</p>
          </div>
          <div className="hidden md:block">
            <Image
              width={500}
              height={500}
              src="/logo-piece-white.png"
              alt="logo"
            />
          </div>
        </div>
      </div>
      <div className="mx-auto mb-10 gap-4 rounded-md bg-zinc-100 px-4 py-16 md:p-16 2xl:my-32">
        <div>
          <h2 className="text-primary-950 pb-2 text-2xl font-bold">
            Vous souhaitez être organisateur ?
          </h2>
          <p className="text-zinc-500">
            Vous souhaitez organiser une Partie Majoritaire, merci de compléter
            le formulaire suivant.
          </p>
          <Button asChild className="mt-4">
            <a
             target="_blank"
             rel="noopener noreferrer"
             href="https://form.jotform.com/eloirelange/inscription-partie-majoritaire">
              Remplir le formulaire
            </a>
          </Button>
        </div>
      </div>
      <Footer />
    </>
  )
}
