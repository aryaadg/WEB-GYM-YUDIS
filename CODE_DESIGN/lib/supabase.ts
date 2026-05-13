import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

const SUPABASE_URL = "https://rmzyioghpvacpjftybyv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtenlpb2docHZhY3BqZnR5Ynl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NTkyNTIsImV4cCI6MjA5MjMzNTI1Mn0.qI2PGFkLCCoiFXr1rFz31qdQufNgBFH1_Lkry8SF4II";

export const createClient = () => {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}