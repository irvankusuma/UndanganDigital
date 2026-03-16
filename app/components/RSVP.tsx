'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Send } from 'lucide-react'

export default function RSVP() {
  const [formData, setFormData] = useState({
    name: '',
    guests: '1',
    status: 'hadir',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated submission
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="py-24 px-4 bg-white text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="max-w-md mx-auto p-12 card-elegant flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <Check size={40} />
          </div>
          <h2 className="font-serif text-3xl mb-4">Terima Kasih!</h2>
          <p className="text-gray-600 italic">Konfirmasi Anda telah kami terima. Sampai jumpa di hari bahagia kami!</p>
        </motion.div>
      </section>
    )
  }

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl text-gray-900 mb-6 italic">Konfirmasi Kehadiran</h2>
          <p className="text-gray-600">Merupakan suatu kehormatan dan kebahagiaan bagi kami <br className="hidden md:block" /> apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.</p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="card-elegant p-8 md:p-12 space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-widest">Nama Lengkap</label>
            <input
              type="text"
              required
              placeholder="Masukkan nama Anda"
              className="input-elegant"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-widest">Jumlah Tamu</label>
              <select
                className="input-elegant"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
              >
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Orang</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-widest">Kehadiran</label>
              <select
                className="input-elegant"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="hadir">Saya Akan Hadir</option>
                <option value="tidak_hadir">Maaf, Tidak Bisa Hadir</option>
                <option value="ragu">Masih Ragu</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-widest">Ucapan & Doa</label>
            <textarea
              rows={4}
              placeholder="Tuliskan ucapan dan doa Anda..."
              className="input-elegant resize-none"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg">
            Kirim Konfirmasi <Send size={20} />
          </button>
        </motion.form>
      </div>
    </section>
  )
}
