'use client'

import Sidebar from '@/components/admin/Sidebar'
import { motion } from 'framer-motion'
import { Users, CheckCircle2, MessageSquare, Clock } from 'lucide-react'

const STATS = [
  { label: 'Total Tamu', value: '128', icon: Users, color: 'blue' },
  { label: 'Konfirmasi Hadir', value: '84', icon: CheckCircle2, color: 'green' },
  { label: 'Ucapan & Doa', value: '42', icon: MessageSquare, color: 'rose' },
  { label: 'Sisa Waktu', value: '15d', icon: Clock, color: 'amber' },
]

export default function DashboardPage() {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Selamat Datang, Admin</h1>
            <p className="text-gray-500 mt-1">Berikut adalah ringkasan undangan Pernikahan Ahmad & Siti</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 px-4 rounded-full border border-gray-100 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-600">Terbit</span>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-${stat.color}-50 text-${stat.color}-600`}>
                <stat.icon size={24} />
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Placeholder for Recent Activity/RSVP List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-lg">Konfirmasi Kehadiran Terbaru</h2>
            <button className="text-rose text-sm font-bold hover:underline">Lihat Semua</button>
          </div>
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <Users size={32} />
            </div>
            <p className="text-gray-400">Belum ada aktivitas RSVP terbaru hari ini.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
