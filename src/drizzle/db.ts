import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "./schema";
import stripe from "stripe";

config({ path: ".env" });

export const client = neon(process.env.DATABASE_URL as string);
export const db = drizzle(client, { schema, logger: true });
export const stripeClient = new stripe(
  process.env.STRIPE_SECRET_KEY as string,
  {
    apiVersion: "2024-06-20",
    typescript: true,
  }
);

export default db;
