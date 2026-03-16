'use client'

import { motion } from 'framer-motion'
import { Heart, MailOpen } from 'lucide-react'
import { Invitation } from '@/types'

interface OpeningScreenProps {
  guestName: string
  inv: Invitation
  onOpen: () => void
  colorHex: string
  tFont: string
  bFont: string
}

export function OpeningScreen({ guestName, inv, onOpen, colorHex, tFont, bFont }: OpeningScreenProps) {
  return (
    <div style={{
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      background: `linear-gradient(135deg, #120508 0%, #2d1218 50%, #120508 100%)`,
      position: 'relative', 
      overflow: 'hidden', 
      fontFamily: bFont
    }}>
      {/* Decorative Overlays */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
        pointerEvents: 'none'
      }} />

      {/* Animated Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={{ 
            opacity: [0, 0.4, 0], 
            scale: [0, 1.2, 0], 
            y: [-20, -150],
            x: Math.sin(i) * 30
          }}
          transition={{ 
            duration: 4 + Math.random() * 2, 
            delay: i * 0.5, 
            repeat: Infinity, 
            ease: "easeOut"
          }}
          style={{
            position: 'absolute',
            left: `${15 + (i * 5)}%`,
            bottom: '15%',
            fontSize: 18,
            filter: 'blur(1px)',
            zIndex: 0
          }}
        >
          {['🌸', '✨', '💕', '🌿', '💎'][i % 5]}
        </motion.div>
      ))}

      {/* Main Content Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ 
          textAlign: 'center', 
          zIndex: 1,
          padding: '40px 24px',
          width: '100%',
          maxWidth: 400
        }}
      >
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, -2, 2, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ 
            fontSize: 80, 
            marginBottom: 32,
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))'
          }}
        >
          💌
        </motion.div>

        <div style={{ marginBottom: 40 }}>
           {guestName && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p style={{ 
                color: 'rgba(255,255,255,0.6)', 
                fontSize: 12, 
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginBottom: 12 
              }}>
                Dear Special Guest,
              </p>
              <h2 style={{ 
                fontFamily: tFont, 
                fontSize: 28, 
                color: '#C9A96E', 
                marginBottom: 24,
                textShadow: '0 2px 10px rgba(201,169,110,0.2)'
              }}>
                {guestName}
              </h2>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p style={{ 
              fontSize: 10, 
              letterSpacing: 6, 
              color: 'rgba(255,255,255,0.4)', 
              textTransform: 'uppercase', 
              marginBottom: 16 
            }}>
              The Wedding Invitation of
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            style={{ marginBottom: 12 }}
          >
            <h1 style={{
              fontFamily: tFont,
              fontSize: 'clamp(42px, 10vw, 64px)',
              fontWeight: 700, 
              color: 'white', 
              lineHeight: 1,
              marginBottom: 16
            }}>
              {inv.bride_name?.split(' ')[0]}
              <span style={{ 
                display: 'block', 
                fontSize: '0.4em', 
                color: colorHex, 
                margin: '8px 0',
                fontFamily: bFont,
                fontWeight: 300
              }}>&</span>
              {inv.groom_name?.split(' ')[0]}
            </h1>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 16, 
              marginBottom: 48 
            }}
          >
            <div style={{ height: 1, width: 40, background: 'linear-gradient(to left, #C9A96E, transparent)' }} />
            <Heart size={14} color={colorHex} fill={colorHex} />
            <div style={{ height: 1, width: 40, background: 'linear-gradient(to right, #C9A96E, transparent)' }} />
          </motion.div>
        </div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          whileHover={{ scale: 1.05, boxShadow: `0 15px 40px ${colorHex}40` }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpen}
          style={{
            background: `linear-gradient(135deg, ${colorHex}, ${colorHex}dd)`,
            color: 'white', 
            border: 'none', 
            borderRadius: 100,
            padding: '18px 48px', 
            fontSize: 15, 
            fontWeight: 700, 
            cursor: 'pointer',
            boxShadow: `0 10px 30px ${colorHex}30`,
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 12,
            fontFamily: bFont,
            letterSpacing: 1
          }}
        >
          <MailOpen size={18} /> Buka Undangan
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0] }}
          transition={{ delay: 3, duration: 3, repeat: Infinity }}
          style={{ 
            color: 'rgba(255,255,255,0.3)', 
            fontSize: 11, 
            marginTop: 32,
            letterSpacing: 2
          }}
        >
          SCROLL UNTUK MELIHAT KEBAHAGIAAN
        </motion.div>
      </motion.div>
    </div>
  )
}
