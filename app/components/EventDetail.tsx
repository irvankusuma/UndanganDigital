'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, Calendar } from 'lucide-react'

interface EventDetailProps {
  ceremony: any
  reception: any
  date: string
}

export default function EventDetail({ ceremony, reception, date }: EventDetailProps) {
  const formattedDate = new Date(date).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="font-serif text-4xl mb-4 text-gray-900 italic">Save the Date</h2>
        <div className="flex items-center justify-center gap-2 text-rose mb-8">
          <Calendar size={20} />
          <span className="font-semibold text-lg">{formattedDate}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Akad Nikah */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="card-elegant p-8 text-center"
        >
          <h3 className="font-serif text-3xl mb-6 text-gradient-gold">{ceremony.title}</h3>
          
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={18} className="text-gold" />
              <span>{ceremony.time}</span>
            </div>
            
            <div className="flex flex-col items-center gap-2 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-gold" />
                <span className="font-bold">{ceremony.location}</span>
              </div>
              <p className="text-sm max-w-[250px]">{ceremony.address}</p>
            </div>
          </div>

          <a
            href={ceremony.maps}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-block no-underline"
          >
            Lihat Lokasi
          </a>
        </motion.div>

        {/* Resepsi */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="card-elegant p-8 text-center"
        >
          <h3 className="font-serif text-3xl mb-6 text-gradient-rose">{reception.title}</h3>
          
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={18} className="text-rose" />
              <span>{reception.time}</span>
            </div>
            
            <div className="flex flex-col items-center gap-2 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-rose" />
                <span className="font-bold">{reception.location}</span>
              </div>
              <p className="text-sm max-w-[250px]">{reception.address}</p>
            </div>
          </div>

          <a
            href={reception.maps}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block no-underline"
          >
            Lihat Lokasi
          </a>
        </motion.div>
      </div>
    </section>
  )
}
