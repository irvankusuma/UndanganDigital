'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin } from 'lucide-react'

interface EventSectionProps {
  inv: any
  colorHex: string
  tFont: string
}

export function EventSection({ inv, colorHex, tFont }: EventSectionProps) {
  return (
    <section style={{ padding: '80px 24px', background: `linear-gradient(135deg, ${colorHex}05 0%, #FDF8F0 100%)` }}>
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p style={{ fontSize: 11, letterSpacing: 4, color: colorHex, textTransform: 'uppercase', fontWeight: 700, marginBottom: 16 }}>Informasi Acara</p>
          <h2 style={{ fontFamily: tFont, fontSize: 32, color: '#1a1a1a', marginBottom: 48 }}>
            Detail Pernikahan
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {/* Akad */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: 'white', borderRadius: 20, padding: 32,
              boxShadow: '0 8px 32px rgba(201,169,110,0.15)',
              border: '1px solid rgba(201,169,110,0.2)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>🕌</div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#C9A96E', marginBottom: 20 }}>Akad Nikah</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                <Calendar size={15} color="#C9A96E" />
                <span style={{ fontSize: 14, color: '#444' }}>
                  {(inv.akad_date || inv.event_date) ? new Date(inv.akad_date || inv.event_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }) : '-'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                <Clock size={15} color="#C9A96E" />
                <span style={{ fontSize: 14, color: '#444' }}>{inv.akad_time || '08:00'} WIB</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, justifyContent: 'center' }}>
                <MapPin size={15} color="#C9A96E" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 14, color: '#444', textAlign: 'center' }}>{inv.akad_location}</span>
              </div>
              {inv.akad_location_url && (
                <a 
                  href={inv.akad_location_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    marginTop: 10, display: 'inline-block', padding: '10px 20px', 
                    borderRadius: 10, background: '#C9A96E', color: 'white', 
                    fontSize: 12, fontWeight: 700, textDecoration: 'none' 
                  }}
                >
                  Buka Google Maps
                </a>
              )}
            </div>
          </motion.div>

          {/* Resepsi */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            style={{
              background: 'white', borderRadius: 20, padding: 32,
              boxShadow: `0 8px 32px ${colorHex}15`,
              border: `1px solid ${colorHex}30`,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>🎊</div>
            <h3 style={{ fontFamily: tFont, fontSize: 22, fontWeight: 700, color: colorHex, marginBottom: 20 }}>Resepsi</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                <Calendar size={15} color="#E8627A" />
                <span style={{ fontSize: 14, color: '#444' }}>
                  {(inv.reception_date || inv.event_date) ? new Date(inv.reception_date || inv.event_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }) : '-'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                <Clock size={15} color="#E8627A" />
                <span style={{ fontSize: 14, color: '#444' }}>{inv.reception_time || '12:00'} WIB</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, justifyContent: 'center' }}>
                <MapPin size={15} color="#E8627A" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 14, color: '#444', textAlign: 'center' }}>{inv.reception_location}</span>
              </div>
              {inv.location_url && (
                <a 
                  href={inv.location_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    marginTop: 10, display: 'inline-block', padding: '10px 20px', 
                    borderRadius: 10, background: colorHex, color: 'white', 
                    fontSize: 12, fontWeight: 700, textDecoration: 'none' 
                  }}
                >
                  Buka Google Maps
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
