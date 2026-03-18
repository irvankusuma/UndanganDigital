import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabaseConfigErrorMessage =
  'Konfigurasi Supabase belum tersedia di deployment ini. Tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di Vercel.'

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(supabaseConfigErrorMessage)
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
