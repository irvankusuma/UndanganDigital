import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

import { supabaseBrowserEnv } from '@/lib/supabase/config'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Root tidak perlu menyentuh Supabase. Langsung redirect agar preview Vercel
  // tetap hidup walaupun session/env auth belum siap.
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // --- NEXTAUTH LOGIC (ADMIN) ---
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const isAuthAdmin = !!token

  if (pathname.startsWith('/admin/dashboard') && !isAuthAdmin) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (pathname === '/admin/login' && isAuthAdmin) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/pengaturan')

  const isAuthRoute =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password'

  const needsSupabaseSession = isProtectedRoute || isAuthRoute

  if (!needsSupabaseSession) {
    return NextResponse.next()
  }

  const supabaseUrl = supabaseBrowserEnv.url
  const supabaseAnonKey = supabaseBrowserEnv.key

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/pengaturan/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/',
  ],
}
