import NextLink from "next/link"
import { VariantProps } from "class-variance-authority"

import { buttonVariants } from "./ui/button"

interface Props
  extends React.ComponentProps<typeof NextLink>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode
}

export function Link({ variant, size, children, className, ...props }: Props) {
  return (
    <NextLink
      className={buttonVariants({ variant, size, className })}
      {...props}
    >
      {children}
    </NextLink>
  )
}
