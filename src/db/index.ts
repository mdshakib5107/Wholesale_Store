import 'dotenv/config'
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '@/db/schema/index'

if (!process.env.DB_CONNECTION_STRING)
  throw new Error("Database url not found!");

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING
})

export const db = drizzle(pool, { schema })