'use client'

import { motion } from 'framer-motion'
import { Heart, ChevronDown } from 'lucide-react'
import { Invitation } from '@/types'

interface HeroSectionProps {
  inv: Invitation
  activeTheme: any
  colorHex: string
  tFont: string
}

export function HeroSection({ inv, activeTheme, colorHex, tFont }: HeroSectionProps) {
  return (
    <section style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, #1a0a0e 0%, #2d1218 40%, ${colorHex}10 100%)`,
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center', 
      padding: '120px 24px', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        height: '300px',
        background: `${colorHex}15`,
        filter: 'blur(80px)',
        borderRadius: '50%',
        zIndex: 0
      }} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        style={{ zIndex: 1 }}
      >
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          style={{ fontSize: 48, display: 'block', marginBottom: 24 }}
        >
          {activeTheme.emoji}
        </motion.span>

        <p style={{ 
          fontSize: 12, 
          letterSpacing: 6, 
          color: '#C9A96E', 
          textTransform: 'uppercase', 
          marginBottom: 20, 
          fontWeight: 600,
          opacity: 0.8
        }}>
          THE WEDDING OF
        </p>

        <h1 style={{
          fontFamily: tFont,
          fontSize: 'clamp(56px, 12vw, 96px)',
          fontWeight: 700, 
          color: 'white', 
          lineHeight: 1, 
          marginBottom: 24,
          textShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          {inv.bride_name?.split(' ')[0]}
          <span style={{ 
            fontSize: '0.4em', 
            fontWeight: 400, 
            color: colorHex,
            display: 'block',
            margin: '10px 0'
          }}>&</span>
          {inv.groom_name?.split(' ')[0]}
        </h1>

        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: 180 }}
          transition={{ delay: 0.8, duration: 1 }}
          viewport={{ once: true }}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 20, 
            marginBottom: 32,
            margin: '0 auto 32px' 
          }}
        >
          <div style={{ height: 1, flex: 1, background: 'linear-gradient(to left, #C9A96E, transparent)' }} />
          <Heart size={20} color={colorHex} fill={colorHex} style={{ filter: `drop-shadow(0 0 10px ${colorHex}50)` }} />
          <div style={{ height: 1, flex: 1, background: 'linear-gradient(to right, #C9A96E, transparent)' }} />
        </motion.div>

        <div style={{ padding: '0 20px' }}>
          <p style={{ 
            fontSize: 18, 
            color: 'rgba(255,255,255,0.8)', 
            marginBottom: 10,
            fontStyle: 'italic',
            letterSpacing: 1
          }}>
            {inv.event_date ? new Date(inv.event_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Tanggal Belum Ditentukan'}
          </p>
          <p style={{ 
            fontSize: 14, 
            color: '#C9A96E',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: 2
          }}>
            {inv.reception_location}
          </p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: 'absolute', bottom: 50, color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
        onClick={() => {
          window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
        }}
      >
        <ChevronDown size={32} strokeWidth={1.5} />
      </motion.div>
    </section>
  )
}
