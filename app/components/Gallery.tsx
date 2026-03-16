'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface GalleryProps {
  images: string[]
}

export default function Gallery({ images }: GalleryProps) {
  return (
    <section className="py-24 px-4 bg-cream">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-rose font-semibold tracking-widest uppercase text-sm mb-4">Galeri Bahagia</p>
          <h2 className="font-serif text-4xl text-gray-900 italic">Momen Indah Kami</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="relative aspect-square overflow-hidden rounded-2xl shadow-lg border-4 border-white"
            >
              <img
                src={src}
                alt={`Momen ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
