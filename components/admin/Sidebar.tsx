'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Heart, 
  Calendar,
  Image as ImageIcon
} from 'lucide-react'

const MENU_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: 'Daftar Tamu', icon: Users, href: '/admin/guests' },
  { label: 'Detail Acara', icon: Calendar, href: '/admin/event' },
  { label: 'Galeri Foto', icon: ImageIcon, href: '/admin/gallery' },
  { label: 'Pengaturan', icon: Settings, href: '/admin/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-50 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-rose to-rose-dark rounded-xl flex items-center justify-center shadow-lg shadow-rose/20">
          <Heart size={20} color="white" fill="white" />
        </div>
        <span className="font-serif font-bold text-xl text-gray-900">Admin Panel</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
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

      <div className="p-4 border-t border-gray-50">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-semibold"
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  )
}
