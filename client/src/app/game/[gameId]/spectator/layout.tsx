import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Spectator",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
