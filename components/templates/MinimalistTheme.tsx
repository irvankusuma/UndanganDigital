import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'

import { Invitation, isFeatureEnabled } from '@/types'
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

export function MinimalistTheme({
  inv, wishes, giftAccounts, lightbox, setLightbox, copiedGift, setCopiedGift,
  rsvp, setRsvp, handleRsvp, colorHex, tFont, bFont, countdown
}: TemplateProps) {
  const activeTheme = { id: 'minimalist', label: 'Gold Minimalist', color: '#C9A96E' }

  return (
    <div style={{ background: '#FAFAFA', minHeight: '100vh', fontFamily: bFont }}>
      <Toaster position="top-center" reverseOrder={false} />
      {isFeatureEnabled(inv, 'music') && inv.music_url && <MusicPlayer url={inv.music_url} />}
      
      <AnimatePresence>
        {lightbox && <Lightbox url={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>

      <div style={{ maxWidth: 800, margin: '0 auto', background: 'white', boxShadow: '0 0 40px rgba(0,0,0,0.03)' }}>
        <HeroSection inv={inv} activeTheme={activeTheme} colorHex={colorHex} tFont={tFont} />
        
        {isFeatureEnabled(inv, 'countdown') && (
          <div style={{ padding: '0 20px' }}>
             <CountdownSection countdown={countdown} colorHex={colorHex} tFont={tFont} />
          </div>
        )}

        <div style={{ height: 1, background: '#eee', width: '80%', margin: '40px auto' }} />

        <CoupleSection inv={inv} colorHex={colorHex} tFont={tFont} />
        
        <div style={{ height: 1, background: '#eee', width: '80%', margin: '40px auto' }} />

        <EventSection inv={inv} colorHex={colorHex} tFont={tFont} />
        
        {isFeatureEnabled(inv, 'gallery') && inv.gallery_images && inv.gallery_images.length > 0 && (
          <>
            <div style={{ height: 1, background: '#eee', width: '80%', margin: '40px auto' }} />
            <GallerySection images={inv.gallery_images} onImageClick={setLightbox} colorHex={colorHex} tFont={tFont} />
          </>
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
    </div>
  )
}
