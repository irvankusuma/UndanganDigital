'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, LayoutDashboard, Mail, Users, Palette, MessageSquare, Gift, Settings, Crown } from 'lucide-react'

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Mail, label: 'Undangan', href: '/dashboard/undangan' },
  { icon: Users, label: 'Manajemen Tamu', href: '/dashboard/tamu' },
  { icon: Palette, label: 'Kustomisasi', href: '/dashboard/kustomisasi' },
  { icon: MessageSquare, label: 'Pesan & Buku Tamu', href: '/dashboard/pesan', badge: 4 },
  { icon: Gift, label: 'Hadiah Digital', href: '/dashboard/hadiah' },
  { icon: Settings, label: 'Pengaturan', href: '/dashboard/pengaturan' },
]

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'white', borderRight: '1px solid #f0f0f0',
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
      boxShadow: '2px 0 16px rgba(0,0,0,0.04)',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #f5f5f5' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #E8627A, #C44A62)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Heart size={16} color="white" fill="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>
              Eternal<span style={{ color: '#E8627A' }}>Invite</span>
            </div>
            <div style={{ fontSize: 10, color: '#aaa', marginTop: -2 }}>Panel Manajemen</div>
          </div>
        </Link>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {SIDEBAR_ITEMS.map((item, i) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href!))
          const Icon = item.icon!

          return (
            <Link key={item.label} href={item.href!}
              onClick={onClose}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                borderRadius: 8, textDecoration: 'none', marginBottom: 4,
                background: isActive ? '#FDE8ED' : 'transparent',
                color: isActive ? '#E8627A' : '#475569',
                fontWeight: isActive ? 600 : 500, 
                fontSize: 14,
                transition: 'all 0.2s',
              }}>
              <Icon size={20} style={{ opacity: isActive ? 1 : 0.7 }} />
              <span>{item.label}</span>
              {'badge' in item && item.badge && !isActive && (
                <span style={{ marginLeft: 'auto', background: '#E8627A', color: 'white', fontSize: 10, padding: '2px 6px', borderRadius: 100 }}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Profile Footer */}
      <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: '#f8fafc', borderRadius: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', background: '#ffedd5',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0
          }}>
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=AndiSarah&backgroundColor=ffedd5" alt="Avatar" style={{ width: '100%', height: '100%' }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Andi & Sarah</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>ID #INV-2410</div>
          </div>
        </div>
      </div>
    </div>
  )
}
