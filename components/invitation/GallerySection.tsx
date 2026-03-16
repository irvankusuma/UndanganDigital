'use client'

import { motion } from 'framer-motion'

interface GallerySectionProps {
  images: string[]
  onImageClick: (url: string) => void
  colorHex: string
  tFont: string
}

export function GallerySection({ images, onImageClick, colorHex, tFont }: GallerySectionProps) {
  if (!images || images.length === 0) return null

  return (
    <section style={{ padding: '80px 24px', background: 'white', textAlign: 'center' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p style={{ fontSize: 11, letterSpacing: 4, color: colorHex, textTransform: 'uppercase', fontWeight: 700, marginBottom: 16 }}>Moment Bahagia</p>
        <h2 style={{ fontFamily: tFont, fontSize: 32, color: '#1a1a1a', marginBottom: 48 }}>Galeri Foto</h2>
        
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
          gap: 12, maxWidth: 900, margin: '0 auto' 
        }}>
          {images.map((img, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              onClick={() => onImageClick(img)}
              style={{ 
                aspectRatio: '1/1', borderRadius: 16, overflow: 'hidden', 
                cursor: 'pointer', background: '#f5f5f5', border: '1px solid #eee' 
              }}
            >
              <img src={img} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
