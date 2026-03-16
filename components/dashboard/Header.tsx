'use client'

import React from 'react'
import { Bell, ChevronDown, Menu, User, Settings, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface HeaderProps {
  user: any
  onMenuClick: () => void
  onLogout: () => void
  notifOpen: boolean
  setNotifOpen: (val: boolean) => void
  profileOpen: boolean
  setProfileOpen: (val: boolean) => void
}

export function Header({ user, onMenuClick, onLogout, notifOpen, setNotifOpen, profileOpen, setProfileOpen }: HeaderProps) {
  return (
    <header style={{
      height: 70, background: 'white', borderBottom: '1px solid #f0f0f0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', position: 'sticky', top: 0, zIndex: 40,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={onMenuClick} className="mobile-only" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
          <Menu size={20} />
        </button>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#888' }} className="desktop-only">
          Selamat datang kembali, <span style={{ color: '#1a1a1a', fontWeight: 700 }}>{user?.name || 'User'}</span> 👋
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setNotifOpen(!notifOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', position: 'relative' }}>
            <Bell size={20} />
            <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#E8627A', borderRadius: '50%', border: '2px solid white' }} />
          </button>
          
          <AnimatePresence>
            {notifOpen && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                style={{ position: 'absolute', top: 40, right: 0, width: 280, background: 'white', borderRadius: 16, boxShadow: '0 10px 40px rgba(0,0,0,0.12)', border: '1px solid #f0f0f0', padding: 12, overflow: 'hidden' }}>
                <div style={{ padding: '8px 12px 12px', borderBottom: '1px solid #f5f5f5', fontWeight: 700, fontSize: 13 }}>Notifikasi</div>
                <div style={{ padding: '12px', fontSize: 12, color: '#888', textAlign: 'center' }}>Belum ada notifikasi baru</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setProfileOpen(!profileOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#FDE8ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E8627A', fontWeight: 700, fontSize: 13 }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="desktop-only" style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{user?.name || 'User'}</span>
            <ChevronDown size={14} color="#aaa" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                style={{ position: 'absolute', top: 44, right: 0, width: 180, background: 'white', borderRadius: 16, boxShadow: '0 10px 40px rgba(0,0,0,0.12)', border: '1px solid #f0f0f0', padding: 8 }}>
                <Link href="/dashboard/pengaturan" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', color: '#444', fontSize: 13 }}>
                  <User size={16} /> Edit Profil
                </Link>
                <div style={{ height: 1, background: '#f5f5f5', margin: '4px 0' }} />
                <button onClick={onLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', background: 'transparent', color: '#EF4444', fontSize: 13, cursor: 'pointer' }}>
                  <LogOut size={16} /> Keluar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
