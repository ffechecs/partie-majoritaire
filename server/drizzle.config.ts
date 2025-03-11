import type { Config } from "drizzle-kit";

// use dotenv
import dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./src/db/schema/*.ts",
  dialect: "sqlite",
  out: "drizzle",
  driver: "turso",
  dbCredentials: {
    authToken: process.env.AUTH_TOKEN!,
    url: process.env.DB_URL!,
  },
} satisfies Config;
