import { drizzle } from "drizzle-orm/postgres-js";
import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";
import * as schema from "./schema";

// Supabase 클라이언트 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Postgres 클라이언트 설정
const connectionString = process.env.DATABASE_URL || "";
const client = postgres(connectionString);

// Drizzle ORM 설정
export const db = drizzle(client, { schema });

export * from "./schema"; 