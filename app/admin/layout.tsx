'use client'

import { SessionProvider } from 'next-auth/react'
import { usePathname } from 'next/navigation'

import Sidebar from '@/components/admin/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  return (
    <SessionProvider>
      {isLoginPage ? (
        children
      ) : (
        <div className="min-h-screen bg-gray-50">
          <Sidebar />
          <main className="md:ml-64 pt-16 md:pt-0">{children}</main>
        </div>
      )}
    </SessionProvider>
  )
}
