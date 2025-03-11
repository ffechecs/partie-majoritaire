import "../styles/globals.css"
import { Metadata } from "next"
import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import Script from "next/script"
import { GoogleAnalytics } from "@next/third-parties/google"

import { ContentIfAuthenticated } from "./header-right"
import { Providers } from "./providers"

const GOOGLE_ANALYTICS_ID = "G-Z7W8PDF3VD"

export const metadata: Metadata = {
  metadataBase: new URL("https://pm.ffechecs.fr"),
  title: "Partie Majoritaire - FFE",
  description: `Partie Majoritaire est une plateforme mise à disposition gratuitement par la Fédération Française des Echecs, destinée aux clubs d'échecs, aux ligues régionales et aux comités départementaux du jeu d'échecs.`,
  openGraph: {
    images: {
      url: "/og-image.jpg",
    },
  },
}

const BREAKPOINTS_PREVIEW_ENABLE = false

function BreakpointsPreview() {
  const breakpoints = [
    {
      color: "bg-green-500",
      minWidth: "max-w-screen-sm",
    },
    {
      color: "bg-blue-500",
      minWidth: "max-w-screen-md",
    },
    {
      color: "bg-yellow-500",
      minWidth: "max-w-screen-lg",
    },
    {
      color: "bg-purple-500",
      minWidth: "max-w-screen-xl",
    },
    {
      color: "bg-pink-500",
      minWidth: "max-w-screen-2xl",
    },
    {
      color: "bg-red-500",
      minWidth: "",
    },
  ]

  return (
    <div className="relative">
      <div className="absolute left-0 right-0 top-0 z-[100] flex h-12 w-full items-center justify-center">
        <span className="text-xl font-bold text-white">
          <span className="block sm:hidden">{"<"}SM</span>
          <span className="hidden sm:block md:hidden">SM</span>
          <span className="hidden md:block lg:hidden">MD</span>
          <span className="hidden lg:block xl:hidden">LG</span>
          <span className="hidden xl:block 2xl:hidden">XL</span>
          <span className="hidden 2xl:block">{">"}2XL</span>
        </span>
      </div>
      {breakpoints.map((breakpoint, i) => (
        <div
          className="absolute left-0 right-0 top-0 flex h-12 w-full items-center justify-center"
          key={breakpoint.minWidth}
          style={{ zIndex: 20 - i }}
        >
          <div
            className={`${breakpoint.color} ${breakpoint.minWidth} absolute top-0 h-12 w-full`}
          />
        </div>
      ))}
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const myCookies = cookies()
  const authSession = myCookies.get("auth_session")
  return (
    <html lang="en">
      <Script id="customerly-script">
        {`
    !function(){var e=window,i=document,t="customerly",n="queue",o="load",r="settings",u=e[t]=e[t]||[];if(u.t){return void u.i("[customerly] SDK already initialized. Snippet included twice.")}u.t=!0;u.loaded=!1;u.o=["event","attribute","update","show","hide","open","close"];u[n]=[];u.i=function(t){e.console&&!u.debug&&console.error&&console.error(t)};u.u=function(e){return function(){var t=Array.prototype.slice.call(arguments);return t.unshift(e),u[n].push(t),u}};u[o]=function(t){u[r]=t||{};if(u.loaded){return void u.i("[customerly] SDK already loaded. Use customerly.update to change settings.")}u.loaded=!0;var e=i.createElement("script");e.type="text/javascript",e.async=!0,e.src="https://messenger.customerly.io/launcher.js";var n=i.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};u.o.forEach(function(t){u[t]=u.u(t)})}();
   
    customerly.load({
          "app_id": "5fa9a666"
    });
         `}
      </Script>

      <body>
        <Providers sessionId={authSession?.value || ""}>
          {BREAKPOINTS_PREVIEW_ENABLE && (
            <div className="absolute left-0 right-0 top-0 z-[100] opacity-30">
              <BreakpointsPreview />
            </div>
          )}
          <div className="flex min-h-screen flex-col">
            <div className="z-40 h-14 border-b p-2">
              <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 2xl:max-w-5xl">
                <Link href="/">
                  <Image
                    alt="Logo de Partie Majoritaire"
                    width={100}
                    height={50}
                    src="/logo/partie-majoritaire.svg"
                  />
                </Link>
                <ContentIfAuthenticated sessionId={authSession?.value || ""} />
              </div>
            </div>
            {children}
          </div>
        </Providers>
      </body>
      <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
    </html>
  )
}
