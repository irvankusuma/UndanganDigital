import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const isAuth = !!req.nextauth.token

    // If at root, redirect to login
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    // If logged in and trying to access login page, redirect to dashboard
    if (isAuth && pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        // Protect /admin/dashboard
        if (pathname.startsWith('/admin/dashboard')) {
          return !!token
        }
        // Allow public access to other pages (including / and /admin/login handles its own logic)
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/', '/admin/:path*'],
}
