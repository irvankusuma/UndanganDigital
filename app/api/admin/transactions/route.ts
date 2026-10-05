import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const id = body?.id as string | undefined
  const action = body?.action as string | undefined

  if (!id || !['approve', 'reject'].includes(action ?? '')) {
    return NextResponse.json({ error: 'Request tidak valid' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: tx, error: txErr } = await supabase
    .from('transactions')
    .select('id, status, user_id')
    .eq('id', id)
    .single()

  if (txErr || !tx) {
    return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 })
  }

  if (tx.status !== 'pending') {
    return NextResponse.json({ error: 'Transaksi sudah diproses sebelumnya' }, { status: 400 })
  }

  const newStatus = action === 'approve' ? 'paid' : 'rejected'

  const { error: updateErr } = await supabase
    .from('transactions')
    .update({ status: newStatus })
    .eq('id', id)

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  if (action === 'approve') {
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 1)

    const { error: profileErr } = await supabase
      .from('profiles')
      .update({ plan: 'premium', plan_expires_at: expiresAt.toISOString() })
      .eq('id', tx.user_id)

    if (profileErr) {
      return NextResponse.json({ error: profileErr.message }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true, status: newStatus })
}
