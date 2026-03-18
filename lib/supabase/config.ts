const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabaseBrowserEnv = {
  url: supabaseUrl,
  key: supabasePublishableKey,
}

export const isSupabaseConfigured = Boolean(supabaseBrowserEnv.url && supabaseBrowserEnv.key)

export const supabaseConfigErrorMessage =
  'Konfigurasi Supabase belum tersedia di deployment ini. Tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY (atau NEXT_PUBLIC_SUPABASE_ANON_KEY) di Vercel.'
