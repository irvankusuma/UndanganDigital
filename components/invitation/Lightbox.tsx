'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'

interface LightboxProps {
  url: string
  onClose: () => void
}

export function Lightbox({ url, onClose }: LightboxProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
        zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <motion.img
        src={url} alt="Gallery"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 12 }}
        onClick={e => e.stopPropagation()}
      />
      <button
        onClick={onClose}
        style={{
          position: 'fixed', top: 20, right: 20,
          width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
          border: 'none', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <X size={20} />
      </button>
    </motion.div>
  )
}
