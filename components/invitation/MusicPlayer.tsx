'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Volume2, VolumeX } from 'lucide-react'

interface MusicPlayerProps {
  url: string
}

export function MusicPlayer({ url }: MusicPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // Autoplay when component mounts (which is after OpeningScreen is closed)
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setPlaying(true)
      }).catch(err => {
        console.log('Autoplay blocked or failed:', err)
      })
    }
  }, [url])

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().catch(() => {})
      setPlaying(true)
    }
  }

  if (!url) return null

  return (
    <div style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 100 }}>
      <audio ref={audioRef} src={url} loop />
      
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggle}
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          cursor: 'pointer',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          border: '1px solid rgba(0,0,0,0.05)',
          color: '#1a1a1a',
          position: 'relative'
        }}
      >
        <AnimatePresence mode="wait">
          {playing ? (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Volume2 size={20} />
              {/* Pulsing animation when playing */}
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  inset: -1,
                  borderRadius: '50%',
                  border: '2px solid #1a1a1a',
                  zIndex: -1
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="paused"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <VolumeX size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
