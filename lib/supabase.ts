import { createClient } from "@supabase/supabase-js";

// Get the environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseKey) {
  console.error('Missing SUPABASE_SECRET_KEY environment variable');
  throw new Error('Missing SUPABASE_SECRET_KEY environment variable');
}

// Initialize the Supabase client with error handling
let supabaseInstance;
try {
  supabaseInstance = createClient(supabaseUrl!, supabaseKey!, {
    auth: {
      persistSession: false,
    }
  });
  console.log("Supabase client initialized successfully");
} catch (error) {
  console.error("Failed to initialize Supabase client:", error);
  throw error;
}

export const supabase = supabaseInstance;