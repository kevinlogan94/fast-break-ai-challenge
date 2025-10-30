// Client-side Supabase client
// Learning: This is like a Nuxt composable - use in Client Components

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // createBrowserClient handles cookies automatically in the browser
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
