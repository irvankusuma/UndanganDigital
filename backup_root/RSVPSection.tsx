'use client'

import { motion } from 'framer-motion'
import { Send, Check, Users } from 'lucide-react'

interface RSVPSectionProps {
  rsvp: {
    name: string
    attendance: string
    count: number
    message: string
    submitted: boolean
  }
  setRsvp: (val: any) => void
  onSubmit: (e: React.FormEvent) => void
  colorHex: string
  tFont: string
}

export function RSVPSection({ rsvp, setRsvp, onSubmit, colorHex, tFont }: RSVPSectionProps) {
  return (
    <section style={{ padding: '100px 24px', background: 'white', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: -100, right: -100,
        width: 300, height: 300,
        background: `${colorHex}08`, borderRadius: '50%', filter: 'blur(60px)',
      }} />

      <div style={{
        maxWidth: 640, margin: '0 auto',
        background: 'white', borderRadius: 40, padding: '64px 40px',
        boxShadow: '0 20px 80px rgba(0,0,0,0.05)',
        border: '1px solid #f0f0f0', textAlign: 'center', position: 'relative', zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div style={{
            width: 50, height: 50, borderRadius: '50%',
            background: `${colorHex}10`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', color: colorHex,
          }}>
            <Users size={24} />
          </div>

          <p style={{ fontSize: 12, letterSpacing: 4, color: colorHex, textTransform: 'uppercase', fontWeight: 700, marginBottom: 16 }}>
            Digital RSVP
          </p>
          <h2 style={{ fontFamily: tFont, fontSize: 'clamp(32px, 5vw, 40px)', color: '#1a1a1a', marginBottom: 16 }}>
            Konfirmasi Kehadiran
          </h2>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 48, lineHeight: 1.6 }}>
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i dapat hadir dan memberikan doa restu.
          </p>

          {rsvp.submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ padding: '40px 0' }}
            >
              <div style={{
                width: 80, height: 80, borderRadius: '50%', background: '#10B981',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px', boxShadow: '0 10px 30px rgba(16,185,129,0.3)',
              }}>
                <Check size={40} />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>Terima Kasih!</h3>
              <p style={{ fontSize: 16, color: '#666' }}>Konfirmasi kehadiran Anda telah sukses kami terima.</p>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label style={{ fontSize: 11, letterSpacing: 1.5, fontWeight: 700, color: '#999', display: 'block', textTransform: 'uppercase', marginBottom: 8 }}>
                  Nama Lengkap
                </label>
                <input
                  value={rsvp.name}
                  onChange={e => setRsvp({ ...rsvp, name: e.target.value })}
                  placeholder="Contoh: Sulaeman & Istri"
                  className="input-inv"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 11, letterSpacing: 1.5, fontWeight: 700, color: '#999', display: 'block', textTransform: 'uppercase', marginBottom: 12 }}>
                  Konfirmasi Kehadiran
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <button
                    type="button"
                    onClick={() => setRsvp({ ...rsvp, attendance: 'attending' })}
                    style={{
                      padding: '16px', borderRadius: 16, border: '2px solid',
                      borderColor: rsvp.attendance === 'attending' ? colorHex : '#f0f0f0',
                      background: rsvp.attendance === 'attending' ? `${colorHex}08` : 'white',
                      color: rsvp.attendance === 'attending' ? colorHex : '#666',
                      fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s ease',
                    }}
                  >
                    ✅ Hadir
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvp({ ...rsvp, attendance: 'not_attending' })}
                    style={{
                      padding: '16px', borderRadius: 16, border: '2px solid',
                      borderColor: rsvp.attendance === 'not_attending' ? '#EF4444' : '#f0f0f0',
                      background: rsvp.attendance === 'not_attending' ? '#FEF2F2' : 'white',
                      color: rsvp.attendance === 'not_attending' ? '#EF4444' : '#666',
                      fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s ease',
                    }}
                  >
                    😔 Berhalangan
                  </button>
                </div>
              </div>

              {rsvp.attendance === 'attending' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label style={{ fontSize: 11, letterSpacing: 1.5, fontWeight: 700, color: '#999', display: 'block', textTransform: 'uppercase', marginBottom: 8 }}>
                    Jumlah Tamu (Pax)
                  </label>
                  <select
                    value={rsvp.count}
                    onChange={e => setRsvp({ ...rsvp, count: parseInt(e.target.value) })}
                    className="input-inv"
                  >
                    {[1, 2, 3, 4, 5].map(v => (
                      <option key={v} value={v}>{v} Orang</option>
                    ))}
                  </select>
                </motion.div>
              )}

              <div>
                <label style={{ fontSize: 11, letterSpacing: 1.5, fontWeight: 700, color: '#999', display: 'block', textTransform: 'uppercase', marginBottom: 8 }}>
                  Ucapan & Doa Restu
                </label>
                <textarea
                  value={rsvp.message || ''}
                  onChange={e => setRsvp({ ...rsvp, message: e.target.value })}
                  placeholder="Tuliskan ucapan & doa terbaik Anda..."
                  className="input-inv"
                  rows={4}
                  style={{ resize: 'none' }}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-inv"
                style={{
                  background: `linear-gradient(135deg, ${colorHex}, ${colorHex}dd)`,
                  marginTop: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  boxShadow: `0 10px 20px ${colorHex}20`,
                }}
              >
                Kirim Konfirmasi & Ucapan <Send size={18} />
              </button>
            </form>
          )}
        </motion.div>
      </div>

      <style jsx>{`
        .input-inv {
          width: 100%;
          padding: 16px 20px;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          font-size: 15px;
          outline: none;
          transition: all 0.2s;
          background: #f9fafb;
          color: #1f2937;
          font-family: inherit;
        }
        .input-inv:focus {
          border-color: ${colorHex};
          background: white;
          box-shadow: 0 0 0 4px ${colorHex}10;
        }
        .btn-inv {
          width: 100%;
          padding: 18px;
          border: none;
          border-radius: 16px;
          color: white;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: inherit;
        }
        .btn-inv:hover {
          opacity: 0.95;
          transform: translateY(-2px);
        }
        .btn-inv:active {
          transform: scale(0.96);
        }
      `}</style>
    </section>
  )
}
