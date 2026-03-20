import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'

import { Invitation, Wish, GiftAccount, isFeatureEnabled } from '@/types'
import { MusicPlayer } from '@/components/invitation/MusicPlayer'
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

export interface TemplateProps {
  inv: Invitation
  wishes: Wish[]
  giftAccounts: GiftAccount[]
  lightbox: string | null
  setLightbox: (url: string | null) => void
  copiedGift: string | null
  setCopiedGift: (acc: string | null) => void
  rsvp: any
  setRsvp: any
  handleRsvp: (e: React.FormEvent) => Promise<void>
  colorHex: string
  tFont: string
  bFont: string
  countdown: any
}

export function ElegantTheme({
  inv, wishes, giftAccounts, lightbox, setLightbox, copiedGift, setCopiedGift,
  rsvp, setRsvp, handleRsvp, colorHex, tFont, bFont, countdown
}: TemplateProps) {
  const activeTheme = { id: 'elegant', label: 'Rose Elegance', color: '#E8627A' }

  return (
    <div style={{ background: '#FFF9F9', minHeight: '100vh', fontFamily: bFont }}>
      <Toaster position="top-center" reverseOrder={false} />
      {isFeatureEnabled(inv, 'music') && inv.music_url && <MusicPlayer url={inv.music_url} />}
      
      <AnimatePresence>
        {lightbox && <Lightbox url={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>

      <HeroSection inv={inv} activeTheme={activeTheme} colorHex={colorHex} tFont={tFont} />
      
      {isFeatureEnabled(inv, 'countdown') && (
        <CountdownSection countdown={countdown} colorHex={colorHex} tFont={tFont} />
      )}

      {/* Decorative Elegant Divider */}
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <img src="/icons/divider-gold.svg" alt="divider" style={{height: 30, opacity: 0.5}} onError={(e) => e.currentTarget.style.display = 'none'} />
      </div>

      <EventSection inv={inv} colorHex={colorHex} tFont={tFont} />
      
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <img src="/icons/divider-gold.svg" alt="divider" style={{height: 30, opacity: 0.5}} onError={(e) => e.currentTarget.style.display = 'none'} />
      </div>

      <CoupleSection inv={inv} colorHex={colorHex} tFont={tFont} />
      
      {isFeatureEnabled(inv, 'gallery') && inv.gallery_images && inv.gallery_images.length > 0 && (
        <GallerySection images={inv.gallery_images} onImageClick={setLightbox} colorHex={colorHex} tFont={tFont} />
      )}

      {isFeatureEnabled(inv, 'gifts') && (
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

      {isFeatureEnabled(inv, 'rsvp') && (
        <RSVPSection rsvp={rsvp} setRsvp={setRsvp} onSubmit={handleRsvp} colorHex={colorHex} tFont={tFont} />
      )}
      
      {isFeatureEnabled(inv, 'wishes') && (
        <WishesSection wishes={wishes} colorHex={colorHex} tFont={tFont} />
      )}

      <FooterSection inv={inv} colorHex={colorHex} tFont={tFont} />
    </div>
  )
}
