import React from 'react'
import { AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

import { isFeatureEnabled } from '@/types'
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
import { TemplateProps } from './ElegantTheme'

export function GardenTheme({
  inv, wishes, giftAccounts, lightbox, setLightbox, copiedGift, setCopiedGift,
  rsvp, setRsvp, handleRsvp, onSubmitWish, colorHex, tFont, bFont, countdown
}: TemplateProps) {
  const activeTheme = { id: 'garden', label: 'Tropical Bloom', color: '#F59E0B', emoji: '🌺' }

  return (
    <div style={{ background: 'linear-gradient(180deg, #FFFCF5 0%, #FFF8E8 100%)', minHeight: '100vh', fontFamily: bFont }}>
      {isFeatureEnabled(inv, 'music') && inv.music_url && <MusicPlayer url={inv.music_url} />}

      <AnimatePresence>
        {lightbox && <Lightbox url={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>

      <HeroSection inv={inv} activeTheme={activeTheme} colorHex={colorHex} tFont={tFont} />

      <div style={{ textAlign: 'center', padding: '32px 0 0', fontSize: 26, letterSpacing: 10, opacity: 0.6 }}>🌺 🌴 🌺</div>

      <EventSection inv={inv} colorHex={colorHex} tFont={tFont} />

      <CoupleSection inv={inv} colorHex={colorHex} tFont={tFont} />

      {isFeatureEnabled(inv, 'countdown') && (
        <CountdownSection countdown={countdown} colorHex={colorHex} tFont={tFont} />
      )}

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
        <WishesSection wishes={wishes} colorHex={colorHex} tFont={tFont} onSubmitWish={onSubmitWish} />
      )}

      <FooterSection inv={inv} colorHex={colorHex} tFont={tFont} />
    </div>
  )
}
