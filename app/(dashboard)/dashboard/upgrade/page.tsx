'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, QrCode, Upload, ArrowRight, ShieldCheck, Zap, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function UpgradePage() {
  const [step, setStep] = useState(1) // 1: Plan Selection, 2: Payment/QRIS, 3: Success
  const [uploading, setUploading] = useState(false)
  const [proofUrl, setProofUrl] = useState('')

  const handleUploadProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Mohon unggah file berupa gambar (JPG/PNG).')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran gambar maksimal 2MB.')
      return
    }

    setUploading(true)
    const toastId = toast.loading('Mengunggah bukti transfer...')

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('payment_proofs')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('payment_proofs')
        .getPublicUrl(filePath)

      setProofUrl(publicUrl)
      
      // Save transaction to database
      const { error: txError } = await supabase.from('transactions').insert({
        user_id: user.id,
        amount: 30000,
        proof_url: publicUrl,
        status: 'pending'
      })

      if (txError) {
        console.error(txError)
        throw new Error('Gagal menyimpan data transaksi.')
      }

      toast.success('Bukti transfer berhasil diunggah!', { id: toastId })
      setStep(3) // Go to success page
      
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan saat mengunggah', { id: toastId })
    } finally {
      setUploading(false)
    }
  }

  const features = [
    'Semua fitur dari paket Gratis',
    'Kapasitas Buku Tamu tak terbatas (Unlimited)',
    'Akses ke semua template desain Premium',
    'Fitur RSVP & Konfirmasi Kehadiran lanjutan',
    'Kirim Notifikasi Pengingat via WhatsApp (Segera)'
  ]

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, color: '#1e293b', marginBottom: 12 }}>
          Upgrade Paket Anda
        </h1>
        <p style={{ fontSize: 16, color: '#64748b', maxWidth: 500, margin: '0 auto' }}>
          Tingkatkan pengalaman pengelolaan undangan digital Anda dengan fitur Premium.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: PLAN SELECTION */}
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ 
              background: 'white', borderRadius: 24, padding: 40,
              boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9',
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
            }}
          >
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'linear-gradient(135deg, #FFF0F3, #FDE8ED)', 
              color: '#E8627A', padding: '6px 16px', borderRadius: 100, 
              fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1,
              marginBottom: 20
            }}>
              <Zap size={14} fill="currentColor" /> Paket Terlaris
            </div>

            <h2 style={{ fontSize: 40, fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>
              Paket Pro <span style={{ color: '#E8627A' }}>1 Bulan</span>
            </h2>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 4, marginBottom: 32 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#64748b', marginTop: 6 }}>Rp</span>
              <span style={{ fontSize: 48, fontWeight: 800, color: '#1e293b', letterSpacing: -1 }}>30.000</span>
              <span style={{ fontSize: 16, fontWeight: 500, color: '#94a3b8', alignSelf: 'flex-end', marginBottom: 8 }}>/ bln</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 400, textAlign: 'left', marginBottom: 40 }}>
              {features.map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#10B98115', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <CheckCircle2 size={12} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: 15, color: '#475569', lineHeight: 1.5 }}>{feat}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              style={{
                background: 'linear-gradient(135deg, #E8627A, #C44A62)',
                color: 'white', border: 'none', borderRadius: 14,
                padding: '16px 32px', fontSize: 16, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(232, 98, 122, 0.2)',
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', maxWidth: 400, justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Lanjut ke Pembayaran <ArrowRight size={18} />
            </button>
            
            <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8', marginTop: 16 }}>
              <ShieldCheck size={14} /> Keamanan pembayaran terjamin (Manual Review)
            </p>
          </motion.div>
        )}

        {/* Step 2: QRIS PAYMENT */}
        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ 
              background: 'white', borderRadius: 24, padding: 40,
              boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>Selesaikan Pembayaran</h2>
              <p style={{ fontSize: 15, color: '#64748b' }}>Scan QRIS di bawah ini dengan aplikasi E-Wallet atau M-Banking Anda.</p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'center' }}>
              {/* QRIS Image Area */}
              <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ 
                  background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: 24, 
                  padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  width: '100%', maxWidth: 300
                }}>
                  <div style={{ 
                    width: 200, height: 200, background: 'white', borderRadius: 16, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: 20
                  }}>
                    {/* PLACEHOLDER UNTUK GAMBAR QRIS ASLI ANDA */}
                    <QrCode size={100} color="#cbd5e1" strokeWidth={1} />
                    {/* Jika Anda punya gambarnya, ganti dengan: <Image src="/qris-anda.jpg" width={180} height={180} alt="QRIS" /> */}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#1e293b', marginBottom: 4 }}>Rp 30.000</div>
                  <div style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center' }}>Bayar tepat sesuai nominal agar mudah direview.</div>
                </div>
              </div>

              {/* Upload Proof Area */}
              <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>
                  Sudah melakukan pembayaran?
                </h3>
                <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>
                  Unggah tangkapan layar (screenshot) bukti transfer sukses dari aplikasi Anda. Admin kami akan segera memverifikasinya.
                </p>

                <label 
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    border: '2px dashed #E8627A', borderRadius: 16, padding: '32px 20px',
                    background: '#FDE8ED', color: '#C44A62', cursor: uploading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s', opacity: uploading ? 0.7 : 1
                  }}
                  onMouseOver={(e) => !uploading && (e.currentTarget.style.background = '#FCE3E9')}
                  onMouseOut={(e) => !uploading && (e.currentTarget.style.background = '#FDE8ED')}
                >
                  <input 
                    type="file" 
                    accept="image/jpeg, image/png, image/jpg" 
                    style={{ display: 'none' }} 
                    onChange={handleUploadProof}
                    disabled={uploading}
                  />
                  {uploading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                      <Zap size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
                    </motion.div>
                  ) : (
                    <Upload size={32} style={{ marginBottom: 12 }} />
                  )}
                  <span style={{ fontSize: 15, fontWeight: 700 }}>
                    {uploading ? 'Mengunggah...' : 'Pilih File Bukti Transfer (JPG/PNG)'}
                  </span>
                  <span style={{ fontSize: 12, opacity: 0.8, marginTop: 8 }}>Maks. ukuran file: 2MB</span>
                </label>

                <button 
                  onClick={() => setStep(1)}
                  style={{ 
                    marginTop: 24, background: 'transparent', border: 'none', color: '#64748b', 
                    fontSize: 14, fontWeight: 600, cursor: 'pointer', textAlign: 'center', width: '100%' 
                  }}
                >
                  Batal / Kembali ke Pilihan Paket
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: SUCCESS PENFDING */}
        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ 
              background: 'white', borderRadius: 24, padding: 60,
              boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9',
              textAlign: 'center'
            }}
          >
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15, delay: 0.2 }}
              style={{ width: 80, height: 80, borderRadius: '50%', background: '#10B98115', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}
            >
              <CheckCircle2 size={40} strokeWidth={2.5} />
            </motion.div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1e293b', marginBottom: 12 }}>
              Bukti Berhasil Diunggah!
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 400, margin: '0 auto 32px', lineHeight: 1.6 }}>
              Terima kasih. Kami telah menerima bukti pembayaran Anda sejumlah <b>Rp 30.000</b>. Admin sedang meninjau transfer Anda dan akun Anda akan di-upgrade ke Paket Pro segera.
            </p>
            
            <button
              onClick={() => window.location.href = '/dashboard'}
              style={{
                background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 14,
                padding: '16px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
              onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
            >
              Kembali ke Dashboard Utama
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
