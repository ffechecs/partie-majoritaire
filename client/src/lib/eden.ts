import { edenTreaty } from "@elysiajs/eden"

import type { App } from "../../../server/src"

export const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
if (!serverUrl) throw new Error("server url not set")
console.log("initializing api with", serverUrl, serverUrl.includes("localhost"))

export const apiServer = edenTreaty<App>(serverUrl)
export const apiClient = edenTreaty<App>(
  "/api"
)
export type EdenAppSubscription = ReturnType<
  (typeof apiClient)["ws"]["subscribe"]
>
export type WsBodyResType = App["_routes"]["ws"]["subscribe"]["body"]
export type WsBodyReqType = App["_routes"]["ws"]["subscribe"]["response"]
