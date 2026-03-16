import LoginForm from '@/components/admin/LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Login - Undangan Digital',
  description: 'Halaman login admin untuk manajemen undangan digital.',
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Semi-transparent background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-rose rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="z-10 w-full flex flex-col items-center">
        <LoginForm />
        
        <p className="mt-8 text-gray-400 text-sm">
          &copy; 2026 EternalInvite. All rights reserved.
        </p>
      </div>
    </main>
  )
}
