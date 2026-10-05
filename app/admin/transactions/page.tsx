import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { createAdminClient } from '@/lib/supabase/admin'
import { TransactionsTable } from '@/components/admin/TransactionsTable'

export const dynamic = 'force-dynamic'

export default async function AdminTransactionsPage() {
  let transactions: any[] = []
  let loadError: string | null = null

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('transactions')
      .select('id, amount, status, proof_url, created_at, profiles:user_id ( id, name, email )')
      .order('created_at', { ascending: false })

    if (error) throw error
    transactions = data || []

    // Bucket payment_proofs privat: tukar URL publik dengan signed URL (1 jam)
    for (const tx of transactions) {
      if (tx.proof_url && tx.proof_url.includes('/payment_proofs/')) {
        const path = decodeURIComponent(tx.proof_url.split('/payment_proofs/')[1])
        const { data: signed } = await supabase.storage.from('payment_proofs').createSignedUrl(path, 3600)
        if (signed?.signedUrl) tx.proof_url = signed.signedUrl
      }
    }
  } catch (err: any) {
    loadError = err?.message || 'Gagal memuat data transaksi'
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 font-medium">
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Kelola Transaksi</h1>
          <p className="text-sm text-gray-500">
            Tinjau bukti transfer pembayaran QRIS dan aktifkan paket Premium pengguna.
          </p>
        </div>

        {loadError ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-700">
            {loadError}
          </div>
        ) : (
          <TransactionsTable initialTransactions={transactions} />
        )}
    </div>
  )
}
