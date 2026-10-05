'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'

interface MusicPlayerProps {
  url: string
}

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([\w-]{11})/,
    /youtube\.com\/.*[?&]v=([\w-]{11})/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export function MusicPlayer({ url }: MusicPlayerProps) {
  const [playing, setPlaying] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const youtubeId = extractYoutubeId(url)

  useEffect(() => {
    if (youtubeId) {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: playing ? 'playVideo' : 'pauseVideo', args: [] }),
        '*'
      )
    } else if (audioRef.current) {
      if (playing) {
        audioRef.current.play().catch(() => setPlaying(false))
      } else {
        audioRef.current.pause()
      }
    }
  }, [playing, youtubeId])

  if (!url) return null

  return (
    <div style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 100 }}>
      {/* Hidden Player */}
      <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', opacity: 0 }}>
        {youtubeId ? (
          <iframe
            ref={iframeRef}
            width={1}
            height={1}
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&controls=0&enablejsapi=1`}
            title="Music"
            frameBorder="0"
            allow="autoplay; encrypted-media"
          />
        ) : (
          <audio ref={audioRef} src={url} loop autoPlay muted={false} />
        )}
      </div>

      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setPlaying(p => !p)}
        aria-label={playing ? 'Matikan musik' : 'Putar musik'}
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
