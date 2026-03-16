'use client'

import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

interface CountdownSectionProps {
  countdown: { d: number, h: number, m: number, s: number }
  colorHex: string
  tFont: string
}

export function CountdownSection({ countdown, colorHex, tFont }: CountdownSectionProps) {
  return (
    <section style={{ padding: '100px 24px', background: 'white', textAlign: 'center', position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div style={{ 
          width: 50, height: 50, borderRadius: '50%', background: `${colorHex}10`, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
          color: colorHex
        }}>
          <Calendar size={24} />
        </div>
        
        <p style={{ fontSize: 12, letterSpacing: 4, color: colorHex, textTransform: 'uppercase', fontWeight: 700, marginBottom: 16 }}>Save The Date</p>
        <h2 style={{ fontFamily: tFont, fontSize: 'clamp(32px, 5vw, 40px)', color: '#1a1a1a', marginBottom: 48 }}>
          Tiada yang lebih berharga selain waktu
        </h2>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {[
            { label: 'Hari', value: countdown.d },
            { label: 'Jam', value: countdown.h },
            { label: 'Menit', value: countdown.m },
            { label: 'Detik', value: countdown.s },
          ].map((item, idx) => (
            <motion.div 
              key={item.label} 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center', minWidth: 80 }}
            >
              <div style={{
                width: 90, height: 100, borderRadius: 24,
                background: 'white',
                border: `1px solid #f0f0f0`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 15px 35px rgba(0,0,0,0.03)`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, height: '4px',
                  background: colorHex, opacity: 0.8
                }} />
                <span style={{ 
                  fontSize: 40, 
                  fontWeight: 800, 
                  color: '#1a1a1a',
                  fontFamily: tFont 
                }}>
                  {String(item.value).padStart(2, '0')}
                </span>
              </div>
              <p style={{ 
                fontSize: 11, 
                color: '#999', 
                marginTop: 16, 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                letterSpacing: 2 
              }}>{item.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
