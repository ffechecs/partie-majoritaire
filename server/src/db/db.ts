import * as schema from "./schema/game";

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

if (process.env.DB_URL === undefined) {
  throw new Error("DB_URL must be set");
}

if (process.env.AUTH_TOKEN === undefined) {
  throw new Error("AUTH_TOKEN must be set");
}

export const client = createClient({
  url: process.env.DB_URL,
  authToken: process.env.AUTH_TOKEN,
  syncUrl: process.env.SYNC_URL,
  // syncInterval: 2, // NOT WORKING FOR NOW THUS DISABLE
});

// if (process.env.SYNC_URL != undefined) {
//   await client.sync();
// }

export const db = drizzle(client, { schema, logger: false });
