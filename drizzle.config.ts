import "dotenv/config";
import { defineConfig } from "drizzle-kit";
//import * as schema from "@/db/schema/index";
if (!process.env.DB_CONNECTION_STRING)
  throw new Error("Database url not found!");

export default defineConfig({
  dialect: "postgresql",
  schema: './src/db/schema/index.ts',
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DB_CONNECTION_STRING,
  },
});
