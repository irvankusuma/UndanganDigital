'use client'

import { useState, useEffect, use } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'

import { createClient } from '@/lib/supabase/client'
import { useCountdown } from '@/lib/hooks/useCountdown'
import { Invitation, Wish, GiftAccount } from '@/types'

// Components
import { MusicPlayer } from '@/components/invitation/MusicPlayer'
import { OpeningScreen } from '@/components/invitation/OpeningScreen'
import { HeroSection } from '@/components/invitation/HeroSection'
import { CountdownSection } from '@/components/invitation/CountdownSection'
import { EventSection } from '@/components/invitation/EventSection'
import { CoupleSection } from '@/components/invitation/CoupleSection'
import { GallerySection } from '@/components/invitation/GallerySection'
import { GiftSection } from '@/components/invitation/GiftSection'
import { RSVPSection } from '@/components/invitation/RSVPSection'
import { WishesSection } from '@/components/invitation/WishesSection'
import { FooterSection } from '@/components/invitation/FooterSection'
import { Lightbox } from '@/components/invitation/Lightbox'

const THEMES = [
  { id: 'elegant', label: 'Rose Elegance', color: '#E8627A', bg: 'linear-gradient(135deg, #FDE8ED, #FFF0F3)', emoji: '🌸', desc: 'Romantis & Elegan' },
  { id: 'minimalist', label: 'Gold Minimalist', color: '#C9A96E', bg: 'linear-gradient(135deg, #FDF8F0, #F5EDD8)', emoji: '✨', desc: 'Modern & Simpel' },
  { id: 'romantic', label: 'Garden Romance', color: '#10B981', bg: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', emoji: '🌿', desc: 'Segar & Alami' },
  { id: 'modern', label: 'Modern Chic', color: '#6366F1', bg: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', emoji: '💎', desc: 'Kontemporer' },
  { id: 'garden', label: 'Tropical Bloom', color: '#F59E0B', bg: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', emoji: '🌺', desc: 'Ceria & Tropis' },
]

export default function InvitationPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ to?: string }>
}) {
  const p = use(paramsPromise)
  const sp = use(searchParamsPromise)

  const [loading, setLoading] = useState(true)
  const [opened, setOpened] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [inv, setInv] = useState<Invitation | null>(null)
  const [wishes, setWishes] = useState<Wish[]>([])
  const [giftAccounts, setGiftAccounts] = useState<GiftAccount[]>([])
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [copiedGift, setCopiedGift] = useState<string | null>(null)
  const [rsvp, setRsvp] = useState({
    name: '',
    attendance: 'attending',
    count: 1,
    message: '',
    submitted: false,
  })

  const targetDate = inv?.event_date || '2025-12-31T00:00:00.000Z'
  const countdown = useCountdown(targetDate)

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      try {
        const supabase = createClient()

        const { data: invData, error: invErr } = await supabase
          .from('invitations')
          .select('*')
          .eq('slug', p.slug)
          .maybeSingle()

        if (invErr || !invData) {
          if (isMounted) setLoading(false)
          return
        }

        const invitation = invData as Invitation

        if (isMounted) setInv(invitation)

        if (sp.to && isMounted) {
          const decodedName = decodeURIComponent(sp.to)
          setGuestName(decodedName)
          setRsvp(prev => ({ ...prev, name: decodedName }))
        }

        // Fetch wishes — check both toggle names
        const wishesEnabled = invitation.wishes_enabled !== false && invitation.enable_wishes !== false
        if (wishesEnabled) {
          const { data: wData } = await supabase
            .from('wishes')
            .select('*')
            .eq('invitation_id', invitation.id)
            .in('status', ['visible', 'pending'])
            .order('created_at', { ascending: false })

          if (wData && isMounted) setWishes(wData as Wish[])
        }

        // Fetch gift accounts — check both toggle names
        const giftEnabled = invitation.gift_enabled !== false && invitation.enable_gifts !== false
        if (giftEnabled) {
          const { data: gData } = await supabase
            .from('gift_accounts')
            .select('*')
            .eq('invitation_id', invitation.id)
            .order('created_at', { ascending: true })

          if (gData && isMounted) setGiftAccounts(gData as GiftAccount[])
        }
      } catch (err) {
        console.error('Error fetching invitation data:', err)
      } finally {
        if (isMounted) {
          setTimeout(() => setLoading(false), 800)
        }
      }
    }
    fetchData()
    return () => {
      isMounted = false
    }
  }, [p.slug, sp.to])

  const handleRsvp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rsvp.attendance || !rsvp.name) {
      toast.error('Lengkapi data Anda')
      return
    }

    const dbStatus = rsvp.attendance === 'attending' ? 'attending' : 'not_attending'

    try {
      const supabase = createClient()

      const { error: guestErr } = await supabase.from('guests').insert({
        invitation_id: inv?.id,
        guest_name: rsvp.name,
        status: dbStatus,
        guest_count: rsvp.attendance === 'attending' ? rsvp.count : 0,
      })

      if (guestErr) throw guestErr

      await supabase.from('rsvp').insert({
        invitation_id: inv?.id,
        guest_name: rsvp.name,
        attendance_status: dbStatus,
        guest_count: rsvp.attendance === 'attending' ? rsvp.count : 0,
        message: rsvp.message || null,
      })

      if (rsvp.message) {
        await supabase.from('wishes').insert({
          invitation_id: inv?.id,
          guest_name: rsvp.name,
          message: rsvp.message,
          status: 'pending',
        })
      }

      setRsvp(prev => ({ ...prev, submitted: true }))
      toast.success('Konfirmasi & Ucapan terkirim! 🎉')

      // Refresh wishes list
      const { data: wData } = await supabase
        .from('wishes')
        .select('*')
        .eq('invitation_id', inv?.id)
        .in('status', ['visible', 'pending'])
        .order('created_at', { ascending: false })
      if (wData) setWishes(wData as Wish[])
    } catch (err) {
      console.error(err)
      toast.error('Gagal mengirim data')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF9F9]">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-6xl mb-4"
        >
          🌸
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-medium text-gray-400 tracking-widest uppercase"
        >
          Menyiapkan Kebahagiaan...
        </motion.p>
      </div>
    )
  }

  if (!inv) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div style={{ fontSize: 64, marginBottom: 16 }}>💌</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Undangan Tidak Ditemukan</h1>
        <p className="text-gray-500">Mohon periksa kembali link undangan Anda.</p>
      </div>
    )
  }

  const activeTheme = THEMES.find(t => t.id === inv.theme) || THEMES[0]
  const colorHex = inv.color_hex || activeTheme.color
  const tFont = `'${inv.font_title || 'Playfair Display'}', serif`
  const bFont = `'${inv.font_body || 'Poppins'}', sans-serif`

  // Resolve feature toggles (support both old and new naming)
  const showCountdown = inv.countdown_enabled !== false && inv.enable_countdown !== false
  const showGift = inv.gift_enabled !== false && inv.enable_gifts !== false
  const showWishes = inv.wishes_enabled !== false && inv.enable_wishes !== false
  const hasGallery = Array.isArray(inv.gallery_images) && inv.gallery_images.length > 0
  const showMusic = (inv.music_enabled || inv.enable_music) && inv.music_url

  if (!opened) {
    return (
      <OpeningScreen
        guestName={guestName}
        inv={inv}
        onOpen={() => setOpened(true)}
        colorHex={colorHex}
        tFont={tFont}
        bFont={bFont}
      />
    )
  }

  return (
    <div style={{ background: '#FFF9F9', minHeight: '100vh', fontFamily: bFont }}>
      <Toaster position="top-center" reverseOrder={false} />

      {showMusic && <MusicPlayer url={inv.music_url!} />}

      <AnimatePresence>
        {lightbox && <Lightbox url={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>

      <HeroSection inv={inv} activeTheme={activeTheme} colorHex={colorHex} tFont={tFont} />

      {showCountdown && (
        <CountdownSection countdown={countdown} colorHex={colorHex} tFont={tFont} />
      )}

      <EventSection inv={inv} colorHex={colorHex} tFont={tFont} />
      <CoupleSection inv={inv} colorHex={colorHex} tFont={tFont} />

      {hasGallery && (
        <GallerySection
          images={inv.gallery_images!}
          onImageClick={setLightbox}
          colorHex={colorHex}
          tFont={tFont}
        />
      )}

      {showGift && giftAccounts.length > 0 && (
        <GiftSection
          giftAccounts={giftAccounts}
          copiedGift={copiedGift}
          onCopy={acc => {
            setCopiedGift(acc)
            navigator.clipboard.writeText(acc)
            toast.success('Berhasil disalin!')
            setTimeout(() => setCopiedGift(null), 2000)
          }}
          colorHex={colorHex}
          tFont={tFont}
        />
      )}

      <RSVPSection
        rsvp={rsvp}
        setRsvp={setRsvp}
        onSubmit={handleRsvp}
        colorHex={colorHex}
        tFont={tFont}
      />

      {showWishes && <WishesSection wishes={wishes} colorHex={colorHex} tFont={tFont} />}

      <FooterSection inv={inv} colorHex={colorHex} tFont={tFont} />
    </div>
  )
}
