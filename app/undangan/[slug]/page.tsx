import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { Invitation, Wish, GiftAccount, isFeatureEnabled } from '@/types'
import { InvitationClient } from './InvitationClient'

export const dynamic = 'force-dynamic'

async function fetchInvitation(slug: string) {
  const supabase = await createClient()

  const { data: invData } = await supabase
    .from('invitations')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (!invData) return null

  const invitation = invData as Invitation

  let wishes: Wish[] = []
  if (isFeatureEnabled(invitation, 'wishes')) {
    const { data: wData } = await supabase
      .from('wishes')
      .select('*')
      .eq('invitation_id', invitation.id)
      .eq('status', 'visible')
      .order('created_at', { ascending: false })
    wishes = (wData as Wish[]) || []
  }

  let giftAccounts: GiftAccount[] = []
  if (isFeatureEnabled(invitation, 'gifts')) {
    const { data: gData } = await supabase
      .from('gift_accounts')
      .select('*')
      .eq('invitation_id', invitation.id)
      .order('created_at', { ascending: true })
    giftAccounts = (gData as GiftAccount[]) || []
  }

  // Gabungkan galeri dari tabel gallery bila JSONB kosong
  let gallery = (invitation.gallery_images as string[] | null) || []
  if (isFeatureEnabled(invitation, 'gallery') && gallery.length === 0) {
    const { data: galData } = await supabase
      .from('gallery')
      .select('image_url')
      .eq('invitation_id', invitation.id)
      .order('order_index', { ascending: true })
    if (galData && galData.length > 0) {
      gallery = galData.map((g: any) => g.image_url)
    }
  }
  invitation.gallery_images = gallery

  return { invitation, wishes, giftAccounts }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const result = await fetchInvitation(slug)

  if (!result) {
    return { title: 'Undangan Tidak Ditemukan | EternalInvite' }
  }

  const inv = result.invitation
  const couple =
    inv.bride_name && inv.groom_name
      ? `${inv.bride_name.split(' ')[0]} & ${inv.groom_name.split(' ')[0]}`
      : inv.event_name
  const date = inv.event_date
    ? new Date(inv.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''
  const title = `The Wedding of ${couple} | EternalInvite`
  const description = `${couple}${date ? ` — ${date}` : ''}. ${inv.reception_location || ''} Buka undangan untuk detail acara, RSVP, dan informasi lainnya.`
  const image = inv.cover_image || inv.bride_photo || undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      ...(image ? { images: [{ url: image }] } : {}),
    },
  }
}

export default async function InvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ to?: string }>
}) {
  const { slug } = await params
  const sp = await searchParams

  const result = await fetchInvitation(slug)
  if (!result) notFound()

  const guestName = sp.to ? decodeURIComponent(sp.to) : ''

  return (
    <InvitationClient
      inv={result.invitation}
      initialWishes={result.wishes}
      giftAccounts={result.giftAccounts}
      guestName={guestName}
    />
  )
}
