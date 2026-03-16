'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

interface HeroProps {
  groom: string
  bride: string
  date: string
}

export default function Hero({ groom, bride, date }: HeroProps) {
  const formattedDate = new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Background with floral pattern placeholder */}
      <div className="absolute inset-0 bg-blush opacity-30 z-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-rose opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold opacity-5 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10"
      >
        <p className="text-gold tracking-[0.3em] font-medium mb-6 uppercase">The Wedding of</p>
        
        <h1 className="font-serif text-6xl md:text-8xl mb-6 text-gradient-rose">
          {groom} <span className="text-4xl md:text-6xl">&</span> {bride}
        </h1>

        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-[1px] w-12 bg-gold-light" />
          <Heart className="text-rose fill-rose animate-pulse" size={20} />
          <div className="h-[1px] w-12 bg-gold-light" />
        </div>

        <p className="text-lg md:text-xl text-gray-600 font-medium italic mb-2">
          {formattedDate}
        </p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 z-10 text-gold-dark cursor-pointer"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <div className="w-6 h-10 border-2 border-gold-dark rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-gold-dark rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
