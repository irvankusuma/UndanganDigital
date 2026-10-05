'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  CreditCard,
  LogOut,
  Heart,
  Menu,
  X,
} from 'lucide-react'

const MENU_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: 'Transaksi', icon: CreditCard, href: '/admin/transactions' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const nav = (
    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
      {MENU_ITEMS.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive
                ? 'bg-rose/5 text-rose font-bold'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )

  const header = (
    <div className="p-6 border-b border-gray-50 flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-rose to-rose-dark rounded-xl flex items-center justify-center shadow-lg shadow-rose/20">
        <Heart size={20} color="white" fill="white" />
      </div>
      <span className="font-serif font-bold text-xl text-gray-900">Admin Panel</span>
    </div>
  )

  const footer = (
    <div className="p-4 border-t border-gray-50">
      <button
        onClick={() => signOut({ callbackUrl: '/admin/login' })}
        className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-semibold"
      >
        <LogOut size={20} />
        <span>Keluar</span>
      </button>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col h-screen fixed left-0 top-0 z-40">
        {header}
        {nav}
        {footer}
      </aside>

      {/* Mobile topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-rose to-rose-dark rounded-lg flex items-center justify-center">
            <Heart size={16} color="white" fill="white" />
          </div>
          <span className="font-serif font-bold text-lg text-gray-900">Admin</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-gray-50 text-gray-700"
          aria-label="Buka menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute top-0 left-0 bottom-0 w-72 bg-white flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
              <span className="font-serif font-bold text-lg text-gray-900">Admin Panel</span>
              <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-gray-50 text-gray-500" aria-label="Tutup menu">
                <X size={20} />
              </button>
            </div>
            {nav}
            {footer}
          </aside>
        </div>
      )}
    </>
  )
}
