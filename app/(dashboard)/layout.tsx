'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [user, setUser] = useState<{ id: string; name: string; email: string; plan: string } | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data: profile } = await supabase.from('profiles').select('id, name, email, plan').eq('id', authUser.id).single()
        if (profile) setUser(profile)
        else setUser({ id: authUser.id, name: authUser.email?.split('@')[0] || 'User', email: authUser.email || '', plan: 'free' })
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Berhasil keluar')
    router.push('/login')
    router.refresh()
  }

  return (
    <div style={{ background: '#fcfcfc', minHeight: '100vh' }}>
      {/* Desktop Sidebar Container */}
      <div className="desktop-only" style={{ 
        width: 240, 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        bottom: 0,
        zIndex: 50
      }}>
        <Sidebar user={user} />
      </div>

      {/* Main Content Area */}
      <div className="main-wrapper" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh' 
      }}>
        {/* Header */}
        <Header 
          user={user} 
          onMenuClick={() => setSidebarOpen(true)} 
          onLogout={handleLogout} 
          notifOpen={notifOpen} 
          setNotifOpen={setNotifOpen} 
          profileOpen={profileOpen} 
          setProfileOpen={setProfileOpen} 
        />

        {/* Dynamic Content */}
        <main 
          style={{ flex: 1, padding: '32px' }} 
          onClick={() => { setNotifOpen(false); setProfileOpen(false) }}
        >
          <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSidebarOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 60 }} 
            />
            <motion.div 
              initial={{ x: -250 }} 
              animate={{ x: 0 }} 
              exit={{ x: -250 }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 70, width: 240 }}
            >
              <button 
                onClick={() => setSidebarOpen(false)} 
                style={{ 
                  position: 'absolute', 
                  right: -40, 
                  top: 15, 
                  background: 'white', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: 32, 
                  height: 32, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                }}
              >
                <X size={18} />
              </button>
              <Sidebar onClose={() => setSidebarOpen(false)} user={user} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .desktop-only { display: block; }
        .mobile-only { display: none; }
        .main-wrapper { margin-left: 240px; }
        
        @media (max-width: 1024px) {
          .desktop-only { display: none; }
          .mobile-only { display: block; }
          .main-wrapper { margin-left: 0; }
        }
      `}</style>
    </div>
  )
}
