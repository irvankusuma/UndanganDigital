'use client'

import { useState, useEffect } from 'react'
import type { CSSProperties, ReactElement } from 'react'
import toast from 'react-hot-toast'
import { Share2, X, MessageCircle, Facebook, Link2 } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { useCountdown } from '@/lib/hooks/useCountdown'
import { Invitation, Wish, GiftAccount, isFeatureEnabled } from '@/types'

import { ElegantTheme } from '@/components/templates/ElegantTheme'
import { MinimalistTheme } from '@/components/templates/MinimalistTheme'
import { RomanticTheme } from '@/components/templates/RomanticTheme'
import { ModernTheme } from '@/components/templates/ModernTheme'
import { GardenTheme } from '@/components/templates/GardenTheme'
import { OpeningScreen } from '@/components/invitation/OpeningScreen'

const THEMES = [
  { id: 'elegant', color: '#E8627A' },
  { id: 'minimalist', color: '#C9A96E' },
  { id: 'romantic', color: '#10B981' },
  { id: 'modern', color: '#6366F1' },
  { id: 'garden', color: '#F59E0B' },
]

interface InvitationClientProps {
  inv: Invitation
  initialWishes: Wish[]
  giftAccounts: GiftAccount[]
  guestName: string
}

function ShareButton() {
  const [open, setOpen] = useState(false)

  const share = (platform: 'whatsapp' | 'facebook' | 'copy' | 'native') => {
    const url = window.location.href
    const text = `Anda diundang! Buka undangan ini untuk detail acara: `

    if (platform === 'native' && typeof navigator.share === 'function') {
      navigator.share({ title: document.title, text, url }).catch(() => {})
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + url)}`, '_blank')
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
    } else {
      navigator.clipboard.writeText(url)
      toast.success('Link undangan disalin!')
    }
    setOpen(false)
  }

  const btnStyle: CSSProperties = {
    width: 42, height: 42, borderRadius: '50%', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'white', boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
  }

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      {open && (
        <>
          <button onClick={() => share('whatsapp')} aria-label="Bagikan ke WhatsApp" style={{ ...btnStyle, color: '#25D366' }}><MessageCircle size={20} /></button>
          <button onClick={() => share('facebook')} aria-label="Bagikan ke Facebook" style={{ ...btnStyle, color: '#1877F2' }}><Facebook size={20} /></button>
          <button onClick={() => share('copy')} aria-label="Salin link undangan" style={{ ...btnStyle, color: '#555' }}><Link2 size={20} /></button>
        </>
      )}
      <button
        onClick={() => (typeof navigator.share === 'function' ? share('native') : setOpen(o => !o))}
        aria-label="Bagikan undangan"
        style={{ ...btnStyle, width: 48, height: 48, background: 'linear-gradient(135deg, #E8627A, #C44A62)', color: 'white' }}
      >
        {open ? <X size={22} /> : <Share2 size={22} />}
      </button>
    </div>
  )
}

export function InvitationClient({ inv, initialWishes, giftAccounts, guestName }: InvitationClientProps) {
  const [opened, setOpened] = useState(false)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [copiedGift, setCopiedGift] = useState<string | null>(null)
  const [rsvp, setRsvp] = useState({ name: guestName, attendance: 'attending', count: 1, message: '', submitted: false })

  const targetDate = inv.event_date || inv.reception_date || ''
  const countdown = useCountdown(targetDate || new Date().toISOString())

  // Muat font kustom (Google Fonts) sesuai pilihan pengguna undangan
  useEffect(() => {
    const families = Array.from(new Set([inv.font_title, inv.font_body].filter(Boolean))) as string[]
    if (families.length === 0) return
    const query = families
      .map(f => `family=${f.replace(/ /g, '+')}:wght@300;400;500;600;700;800`)
      .join('&')
    const href = `https://fonts.googleapis.com/css2?${query}&display=swap`
    if (document.querySelector(`link[href="${href}"]`)) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
  }, [inv.font_title, inv.font_body])

  const handleRsvp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rsvp.name) {
      toast.error('Lengkapi nama Anda')
      return
    }

    try {
      const supabase = createClient()
      const attendanceStatus: 'attending' | 'not_attending' =
        rsvp.attendance === 'attending' ? 'attending' : 'not_attending'

      const { error: guestErr } = await supabase.from('guests').insert({
        invitation_id: inv.id,
        guest_name: rsvp.name,
        status: attendanceStatus,
        guest_count: attendanceStatus === 'attending' ? rsvp.count : 0,
      })
      if (guestErr) throw guestErr

      const { error: rsvpErr } = await supabase.from('rsvp').insert({
        invitation_id: inv.id,
        guest_name: rsvp.name,
        attendance_status: attendanceStatus,
        guest_count: attendanceStatus === 'attending' ? rsvp.count : 0,
        message: rsvp.message || null,
      })
      if (rsvpErr) throw rsvpErr

      if (rsvp.message) {
        await supabase.from('wishes').insert({
          invitation_id: inv.id,
          guest_name: rsvp.name,
          message: rsvp.message,
          status: 'pending',
        })
      }

      setRsvp(prev => ({ ...prev, submitted: true }))
      toast.success(
        rsvp.message
          ? 'Konfirmasi terkirim! Ucapan Anda menunggu moderasi. 🎉'
          : 'Konfirmasi kehadiran terkirim! 🎉'
      )
    } catch (err) {
      console.error(err)
      toast.error('Gagal mengirim konfirmasi. Coba lagi.')
    }
  }

  const handleSubmitWish = async (name: string, message: string): Promise<boolean> => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from('wishes').insert({
        invitation_id: inv.id,
        guest_name: name,
        message,
        status: 'pending',
      })
      if (error) throw error
      return true
    } catch (err) {
      console.error(err)
      toast.error('Gagal mengirim ucapan. Coba lagi.')
      return false
    }
  }

  if (!opened) {
    const activeTheme = THEMES.find(t => t.id === inv.theme) || THEMES[0]
    const colorHex = inv.color_hex || activeTheme.color
    return (
      <OpeningScreen
        guestName={guestName}
        inv={inv}
        onOpen={() => setOpened(true)}
        colorHex={colorHex}
        tFont={`'${inv.font_title || 'Playfair Display'}', serif`}
        bFont={`'${inv.font_body || 'Poppins'}', sans-serif`}
      />
    )
  }

  const activeTheme = THEMES.find(t => t.id === inv.theme) || THEMES[0]
  const colorHex = inv.color_hex || activeTheme.color
  const tFont = `'${inv.font_title || 'Playfair Display'}', serif`
  const bFont = `'${inv.font_body || 'Poppins'}', sans-serif`

  // Countdown hanya tampil bila ada tanggal acara
  const invForRender: Invitation = {
    ...inv,
    enable_countdown: isFeatureEnabled(inv, 'countdown') && !!targetDate,
  }

  const templateProps = {
    inv: invForRender,
    wishes: initialWishes,
    giftAccounts,
    lightbox,
    setLightbox,
    copiedGift,
    setCopiedGift,
    rsvp,
    setRsvp,
    handleRsvp,
    onSubmitWish: isFeatureEnabled(inv, 'wishes') ? handleSubmitWish : undefined,
    colorHex,
    tFont,
    bFont,
    countdown,
  }

  const themeMap: Record<string, (props: typeof templateProps) => ReactElement> = {
    minimalist: MinimalistTheme,
    romantic: RomanticTheme,
    modern: ModernTheme,
    garden: GardenTheme,
  }
  const ThemeComponent = themeMap[inv.theme] || ElegantTheme

  return (
    <>
      <ThemeComponent {...templateProps} />
      <ShareButton />
    </>
  )
}
