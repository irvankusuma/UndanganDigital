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
  { icon: MessageSquare, label: 'Pesan & Buku Tamu', href: '/dashboard/pesan', badge: 0 },
  { icon: Gift, label: 'Hadiah Digital', href: '/dashboard/hadiah' },
  { icon: Settings, label: 'Pengaturan', href: '/dashboard/pengaturan' },
]

interface SidebarProps {
  onClose?: () => void
  user?: { id: string; name: string; email: string; plan: string } | null
}

export function Sidebar({ onClose, user }: SidebarProps) {
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
        <Link href="/dashboard" onClick={onClose} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
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
        {SIDEBAR_ITEMS.map((item) => {
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
            </Link>
          )
        })}
      </nav>

      {/* Upgrade CTA */}
      {user?.plan !== 'pro' && (
        <div style={{ padding: '0 12px 12px' }}>
          <Link href="/dashboard/upgrade" onClick={onClose} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 14px', borderRadius: 12,
            background: 'linear-gradient(135deg, #FDF8F0, #F5EDD8)',
            border: '1.5px solid #E8D5B0',
            textDecoration: 'none', transition: 'all 0.2s',
          }}>
            <Crown size={18} color="#C9A96E" />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#8B6914' }}>Upgrade ke Pro</div>
              <div style={{ fontSize: 10, color: '#A08040' }}>Fitur lengkap tanpa batas</div>
            </div>
          </Link>
        </div>
      )}

      {/* User Profile Footer */}
      <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9' }}>
        <Link href="/dashboard/pengaturan" onClick={onClose} style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: '#f8fafc', borderRadius: 8, cursor: 'pointer', transition: 'background 0.2s' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', background: '#FDE8ED',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#E8627A', fontSize: 14, fontWeight: 700, flexShrink: 0
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email || ''}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
