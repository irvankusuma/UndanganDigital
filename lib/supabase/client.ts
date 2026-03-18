import { createBrowserClient } from '@supabase/ssr'

import { supabaseBrowserEnv, supabaseConfigErrorMessage } from './config'

export { isSupabaseConfigured, supabaseConfigErrorMessage } from './config'

export function createClient() {
  if (!supabaseBrowserEnv.url || !supabaseBrowserEnv.key) {
    throw new Error(supabaseConfigErrorMessage)
  }

  return createBrowserClient(supabaseBrowserEnv.url, supabaseBrowserEnv.key)
}
