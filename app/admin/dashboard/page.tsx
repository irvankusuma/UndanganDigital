import Link from 'next/link'
import { Users, Mail, CreditCard, Crown, ArrowRight } from 'lucide-react'

import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  let stats = { users: 0, invitations: 0, pendingTx: 0, premiumUsers: 0 }
  let recentUsers: any[] = []
  let recentTx: any[] = []
  let loadError: string | null = null

  try {
    const supabase = createAdminClient()

    const [usersRes, invRes, pendingRes, premiumRes, recentUsersRes, recentTxRes] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('invitations').select('id', { count: 'exact', head: true }),
      supabase.from('transactions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('plan', 'premium'),
      supabase.from('profiles').select('id, name, email, plan, created_at').order('created_at', { ascending: false }).limit(5),
      supabase
        .from('transactions')
        .select('id, amount, status, created_at, profiles:user_id ( name, email )')
        .order('created_at', { ascending: false })
        .limit(5),
    ])

    stats = {
      users: usersRes.count ?? 0,
      invitations: invRes.count ?? 0,
      pendingTx: pendingRes.count ?? 0,
      premiumUsers: premiumRes.count ?? 0,
    }
    recentUsers = recentUsersRes.data || []
    recentTx = recentTxRes.data || []
  } catch (err: any) {
    loadError = err?.message || 'Gagal memuat data'
  }

  const statCards = [
    { label: 'Total Pengguna', value: stats.users, icon: Users, cls: 'bg-blue-50 text-blue-600' },
    { label: 'Total Undangan', value: stats.invitations, icon: Mail, cls: 'bg-rose-50 text-rose' },
    { label: 'Transaksi Pending', value: stats.pendingTx, icon: CreditCard, cls: 'bg-amber-50 text-amber-600' },
    { label: 'Pengguna Premium', value: stats.premiumUsers, icon: Crown, cls: 'bg-emerald-50 text-emerald-600' },
  ]

  return (
    <div className="p-4 sm:p-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">Ringkasan aktivitas platform EternalInvite.</p>
      </header>

      {loadError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 mb-8">
          {loadError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {statCards.map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.cls}`}>
              <stat.icon size={24} />
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pengguna terbaru */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="font-bold text-gray-900">Pengguna Terbaru</h2>
          </div>
          {recentUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">Belum ada pengguna terdaftar.</div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recentUsers.map(u => (
                <li key={u.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{u.name || 'Tanpa Nama'}</div>
                    <div className="text-xs text-gray-500 truncate">{u.email}</div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full flex-shrink-0 ${u.plan === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                    {u.plan}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Transaksi terbaru */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Transaksi Terbaru</h2>
            <Link href="/admin/transactions" className="text-rose text-sm font-bold hover:underline inline-flex items-center gap-1">
              Kelola <ArrowRight size={14} />
            </Link>
          </div>
          {recentTx.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">Belum ada transaksi.</div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recentTx.map(tx => {
                const p = Array.isArray(tx.profiles) ? tx.profiles[0] : tx.profiles
                return (
                  <li key={tx.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">{p?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(tx.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' · '}
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(tx.amount || 0)}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full flex-shrink-0 text-white ${tx.status === 'paid' ? 'bg-emerald-500' : tx.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'}`}>
                      {tx.status}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
