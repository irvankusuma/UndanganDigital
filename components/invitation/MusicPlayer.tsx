'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Volume2, VolumeX } from 'lucide-react'
import ReactPlayer from 'react-player'

interface MusicPlayerProps {
  url: string
}

export function MusicPlayer({ url }: MusicPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    setPlaying(true)
  }, [url])

  const toggle = () => {
    setPlaying(!playing)
  }

  if (!url || !hasMounted) return null

  // Loose check for YouTube, fallback to native audio for direct links
  const isYoutube = url.includes('youtube.com') || url.includes('youtu.be')

  return (
    <div style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 100 }}>
      {/* Hidden Player */}
      <div style={{ display: 'none' }}>
        {isYoutube ? (
          <ReactPlayer 
            url={url} 
            playing={playing} 
            loop={true} 
            volume={1} 
            width="0" 
            height="0" 
            // @ts-ignore
            config={{ youtube: { playerVars: { autoplay: 1 } } }}
          />
        ) : (
          <audio src={url} loop autoPlay={playing} muted={!playing} />
        )}
      </div>
      
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
