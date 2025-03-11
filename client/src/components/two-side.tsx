/* eslint-disable @next/next/no-img-element */
import Image from "next/image"

export default function TwoSide({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full flex-1 md:grid md:grid-cols-2">
      <div className="relative bg-primary">
        <div className="relative block h-full md:hidden">
          <img
            src="/bg.jpg"
            alt="logo"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="relative flex flex-col items-center justify-center">
            <span className="p-10 text-2xl font-bold text-white">
              Bienvenue sur la plateforme de Partie Majoritaire
            </span>
          </div>
        </div>

        <div className="relative hidden h-full md:block">
          <img
            src="/bg.jpg"
            alt="logo"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center bg-gradient-to-t from-blue-900 to-black/0">
            <span className="p-16 text-2xl font-bold text-white">
              Bienvenue sur la plateforme de Partie Majoritaire
            </span>
          </div>
        </div>
      </div>
      <div className="">{children}</div>
    </div>
  )
}
