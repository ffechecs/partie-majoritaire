/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import * as Portal from "@radix-ui/react-portal"
import { AnimatePresence, motion } from "framer-motion"

interface PopUpProps {
  children: React.ReactNode
  duration: number // in seconds
}

export function PopUp({ children, duration }: PopUpProps) {
  const router = useRouter()
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (router.query["pop-up"] === "true") {
      return
    }
    const timeout = setTimeout(() => {
      setShow(false)
    }, duration * 1000)
    return () => {
      clearTimeout(timeout)
    }
  }, [duration, router.query])

  // if url query params contains "pop-up=false", don't show the pop-up
  if (router.query["pop-up"] === "false") {
    return null
  }
  return (
    <AnimatePresence>
      {show ? (
        <Portal.Root key="portal-root" className="absolute inset-0 z-50">
          <motion.div
            key="pop-up-panel"
            initial={{ translateX: "-100%" }}
            animate={{ translateX: "0%" }}
            exit={{ translateX: "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="bg-tertiary-950 relative flex h-full w-full flex-col items-center justify-center gap-8 text-center text-4xl font-bold text-white md:text-6xl"
          >
            <div className="absolute top-20 flex flex-row gap-8 pb-8">
              <img
                src="/assets/class-échecs.svg"
                className="mx-auto w-48 2xl:w-64"
              />
              <img
                src="/assets/le_défi.svg"
                className="mx-auto w-48 2xl:w-64"
              />
            </div>
            <img
              src="/assets/pawn.svg"
              className="absolute left-4 top-4 my-auto h-32 opacity-25 md:h-64 2xl:h-96"
            />
            <img
              src="/assets/pawn.svg"
              className="absolute bottom-4 right-4 my-auto h-32 -scale-x-100 opacity-25 md:h-64 2xl:h-96"
            />

            <img
              src="/assets/background/bottom-right.svg"
              className="absolute bottom-0 left-0 -z-10 w-96 -scale-x-100 opacity-20 2xl:w-[32rem]"
            />
            <img
              src="/assets/background/bottom-left.svg"
              className="2xl absolute right-0 top-0 -z-10 w-64 rotate-180 opacity-20"
            />
            {children}
          </motion.div>
        </Portal.Root>
      ) : null}
    </AnimatePresence>
  )
}
