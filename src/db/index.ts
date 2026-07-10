import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@/env/server";

export function createDb() {
	return drizzle(env.DATABASE_URL);
}

export const db = createDb();
