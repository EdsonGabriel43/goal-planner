import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  // Warn only during build to avoid crashing static generation if not strictly needed
  if (typeof window === 'undefined') {
    console.warn('Supabase Env Vars missing during server-side render/build.');
  } else {
    throw new Error('Supabase Url and Key are required!');
  }
}

export const createClient = () =>
  createBrowserClient(
    supabaseUrl || 'https://placeholder.supabase.co', // Prevent crash
    supabaseKey || 'placeholder'
  )

// Singleton instance for client-side usage
export const supabase = createClient()
