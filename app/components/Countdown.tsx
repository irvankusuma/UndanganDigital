'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CountdownProps {
  targetDate: string
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    hari: 0,
    jam: 0,
    menit: 0,
    detik: 0
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date(targetDate).getTime()
      const now = new Date().getTime()
      const distance = target - now

      if (distance < 0) {
        clearInterval(timer)
        return
      }

      setTimeLeft({
        hari: Math.floor(distance / (1000 * 60 * 60 * 24)),
        jam: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        menit: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        detik: Math.floor((distance % (1000 * 60)) / 1000)
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <section className="py-16 bg-gradient-to-r from-rose to-rose-dark text-white text-center">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="font-serif text-2xl mb-12 italic opacity-90">Menghitung Hari Bahagia</h2>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-12">
          {Object.entries(timeLeft).map(([label, value]) => (
            <motion.div
              key={label}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 md:w-28 md:h-28 glass flex items-center justify-center rounded-2xl mb-4 border-white/20">
                <span className="text-3xl md:text-5xl font-bold">{value}</span>
              </div>
              <span className="uppercase tracking-widest text-xs md:text-sm font-semibold opacity-80">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
