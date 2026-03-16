'use client'

import { useState, useEffect, use } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'

import { createClient } from '@/lib/supabase/client'
import { useCountdown } from '@/lib/hooks/useCountdown'
import { Invitation, Wish, GiftAccount, RSVP } from '@/types'

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

export default function InvitationPage({ params: paramsPromise, searchParams: searchParamsPromise }: {
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
  
  const [rsvp, setRsvp] = useState({ name: '', attendance: 'attending', count: 1, message: '', submitted: false })
  
  const targetDate = inv?.event_date || '2025-12-31T00:00:00.000Z'
  const countdown = useCountdown(targetDate)

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      try {
        const supabase = createClient()
        
        // Fetch Invitation
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

        // Set Guest Name
        if (sp.to && isMounted) {
          const decodedName = decodeURIComponent(sp.to)
          setGuestName(decodedName)
          setRsvp(prev => ({ ...prev, name: decodedName }))
        }

        // Fetch Wishes
        if (invitation.wishes_enabled !== false) {
           const { data: wData } = await supabase
            .from('wishes')
            .select('*')
            .eq('invitation_id', invitation.id)
            .in('status', ['visible', 'pending'])
            .order('created_at', { ascending: false })
            
           if (wData && isMounted) {
             setWishes(wData as Wish[])
           }
        }
        
        // Fetch Gift Accounts
        if (invitation.gift_enabled !== false) {
           const { data: gData } = await supabase
            .from('gift_accounts')
            .select('*')
            .eq('invitation_id', invitation.id)
            .order('created_at', { ascending: true })
            
           if (gData && isMounted) setGiftAccounts(gData as GiftAccount[])
        }
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        if (isMounted) {
          // Add a slight artificial delay for a smoother transition
          setTimeout(() => setLoading(false), 800)
        }
      }
    }
    fetchData()
    return () => { isMounted = false }
  }, [p.slug, sp.to])

  const handleRsvp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rsvp.attendance || !rsvp.name) { 
      toast.error('Lengkapi data Anda')
      return 
    }
    
    try {
      const supabase = createClient()
      
      // Update guests table (Attendance)
      const { error: guestErr } = await supabase.from('guests').insert({
        invitation_id: inv?.id,
        guest_name: rsvp.name,
        status: rsvp.attendance === 'attending' ? 'attending' : 'not_attending',
        guest_count: rsvp.attendance === 'attending' ? rsvp.count : 0
      })
      
      if (guestErr) throw guestErr

      // Update rsvp table (Consolidated data)
      await supabase.from('rsvp').insert({
        invitation_id: inv?.id,
        guest_name: rsvp.name,
        attendance_status: rsvp.attendance === 'attending' ? 'attending' : 'not_attending',
        guest_count: rsvp.attendance === 'attending' ? rsvp.count : 0,
        message: rsvp.message
      })

      // Insert into wishes table if there is a message
      if (rsvp.message) {
        await supabase.from('wishes').insert({
          invitation_id: inv?.id,
          guest_name: rsvp.name,
          message: rsvp.message,
          status: 'pending' // Admin can moderate
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



  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = `Anda diundang ke pernikahan ${inv?.event_name}! 💍`
    
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`)
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url)
      toast.success('Link disalin!')
    }
  }

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF9F9]">
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 360]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
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

  if (!inv) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Undangan Tidak Ditemukan</h1>
      <p className="text-gray-500">Mohon periksa kembali link undangan Anda.</p>
    </div>
  )

  const activeTheme = THEMES.find(t => t.id === inv.theme) || THEMES[0]
  const colorHex = inv.color_hex || activeTheme.color
  // @ts-ignore
  const tFont = `'${inv.font_title || 'Playfair Display'}', serif`
  // @ts-ignore
  const bFont = `'${inv.font_body || 'Poppins'}', sans-serif`

  if (!opened) return (
    <OpeningScreen guestName={guestName} inv={inv} onOpen={() => setOpened(true)} colorHex={colorHex} tFont={tFont} bFont={bFont} />
  )

  return (
    <div style={{ background: '#FFF9F9', minHeight: '100vh', fontFamily: bFont }}>
      <Toaster position="top-center" reverseOrder={false} />
      {inv.music_enabled && inv.music_url && <MusicPlayer url={inv.music_url} />}
      
      <AnimatePresence>
        {lightbox && <Lightbox url={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>

      <HeroSection inv={inv} activeTheme={activeTheme} colorHex={colorHex} tFont={tFont} />
      
      {/* @ts-ignore */}
      {inv.countdown_enabled !== false && (
        <CountdownSection countdown={countdown} colorHex={colorHex} tFont={tFont} />
      )}

      <EventSection inv={inv} colorHex={colorHex} tFont={tFont} />
      <CoupleSection inv={inv} colorHex={colorHex} tFont={tFont} />
      
      {/* @ts-ignore */}
      {inv.gallery_images && (
        // @ts-ignore
        <GallerySection images={inv.gallery_images} onImageClick={setLightbox} colorHex={colorHex} tFont={tFont} />
      )}

      {inv.gift_enabled !== false && (
        <GiftSection 
          giftAccounts={giftAccounts} 
          copiedGift={copiedGift} 
          onCopy={(acc) => { 
            setCopiedGift(acc)
            navigator.clipboard.writeText(acc)
            toast.success('Berhasil disalin!')
            setTimeout(() => setCopiedGift(null), 2000)
          }} 
          colorHex={colorHex} 
          tFont={tFont} 
        />
      )}

      <RSVPSection rsvp={rsvp} setRsvp={setRsvp} onSubmit={handleRsvp} colorHex={colorHex} tFont={tFont} />
      
      {/* @ts-ignore */}
      {inv.wishes_enabled !== false && (
        <WishesSection wishes={wishes} colorHex={colorHex} tFont={tFont} />
      )}

      <FooterSection inv={inv} colorHex={colorHex} tFont={tFont} />
    </div>
  )
}
