import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  )

  // --- NEXTAUTH LOGIC (ADMIN) ---
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const isAuthAdmin = !!token
  const pathname = request.nextUrl.pathname

  // Redirect / to /login
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Protect /admin/dashboard
  if (pathname.startsWith('/admin/dashboard') && !isAuthAdmin) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Redirect logged in admin away from login page
  if (pathname === '/admin/login' && isAuthAdmin) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  // --- SUPABASE LOGIC (DASHBOARD) ---
  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()

  // Protect dashboard and settings routes
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/undangan/baru') ||
    pathname.startsWith('/pengaturan')

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect logged in users away from auth pages
  const isAuthRoute = 
    pathname === '/login' || 
    pathname === '/register'

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/dashboard/:path*',
    '/undangan/baru',
    '/pengaturan/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

