import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://blcfzmugnbojyckzjcew.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsY2Z6bXVnbmJvanlja3pqY2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MTQzMTQsImV4cCI6MjA4MTk5MDMxNH0.Jcf3cJz12uXWQoxe7ZGlH1CSqZ2PkziVDP6bjkTqklU";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
