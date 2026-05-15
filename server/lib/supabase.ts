import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("CRITICAL: Supabase environment variables are missing! VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not defined.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
