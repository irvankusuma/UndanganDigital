'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Loader, Save } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

const STEPS = ['Info Acara', 'Pasangan', 'Detail Acara', 'Tema & Musik', 'Simpan']

const THEMES = [
  { id: 'elegant', label: 'Rose Elegance', color: '#E8627A', emoji: '🌸' },
  { id: 'minimalist', label: 'Gold Minimalist', color: '#C9A96E', emoji: '✨' },
  { id: 'romantic', label: 'Garden Romance', color: '#10B981', emoji: '🌿' },
  { id: 'modern', label: 'Modern Chic', color: '#6366F1', emoji: '💎' },
  { id: 'garden', label: 'Tropical Bloom', color: '#F59E0B', emoji: '🌺' },
]

const EVENT_TYPES = [
  { id: 'wedding', label: 'Pernikahan', emoji: '💍' },
  { id: 'birthday', label: 'Ulang Tahun', emoji: '🎂' },
  { id: 'family', label: 'Acara Keluarga', emoji: '👨‍👩‍👧‍👦' },
  { id: 'seminar', label: 'Seminar/Event', emoji: '🎤' },
  { id: 'other', label: 'Lainnya', emoji: '🎉' },
]

export default function EditInvitationPage() {
  const router = useRouter()
  const params = useParams()
  const invId = params?.id as string

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [form, setForm] = useState({
    event_name: '',
    event_type: 'wedding',
    slug: '',
    bride_name: '',
    groom_name: '',
    event_date: '',
    akad_date: '',
    akad_time: '',
    akad_location: '',
    reception_date: '',
    reception_time: '',
    reception_location: '',
    story: '',
    theme: 'elegant',
    music_url: '',
    music_enabled: false,
    location_url: '',
    description: '',
    bride_father_name: '',
    bride_mother_name: '',
    groom_father_name: '',
    groom_mother_name: '',
  })

  // Load actual data
  useEffect(() => {
    const load = async () => {
      if (!invId) return
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from('invitations').select('*').eq('id', invId).single()
        if (error) throw error
        if (data) {
          // Fill form with current data, convert nulls back to empty strings for inputs
          const cleanData = { ...data }
          Object.keys(cleanData).forEach(key => {
            if (cleanData[key] === null) (cleanData as any)[key] = ''
          })
          setForm(prev => ({ ...prev, ...cleanData }))
        }
      } catch (err) {
        console.error('Load error:', err)
        toast.error('Gagal memuat data undangan')
      } finally {
        setFetching(false)
      }
    }
    load()
  }, [invId])

  const update = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSave = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      
      // Sanitize: '' -> null
      const sanitizedData = {
        event_name: form.event_name,
        slug: form.slug,
        event_type: form.event_type,
        bride_name: form.bride_name || null,
        groom_name: form.groom_name || null,
        story: form.story || null,
        event_date: form.event_date || null,
        akad_date: form.akad_date || null,
        akad_time: form.akad_time || null,
        akad_location: form.akad_location || null,
        reception_date: form.reception_date || null,
        reception_time: form.reception_time || null,
        reception_location: form.reception_location || null,
        location_url: form.location_url || null,
        description: form.description || null,
        theme: form.theme,
        music_url: form.music_url || null,
        music_enabled: form.music_enabled,
        bride_father_name: form.bride_father_name || null,
        bride_mother_name: form.bride_mother_name || null,
        groom_father_name: form.groom_father_name || null,
        groom_mother_name: form.groom_mother_name || null,
      }

      const { error } = await supabase.from('invitations').update(sanitizedData).eq('id', invId)
      
      if (error) throw error
      
      toast.success('Undangan berhasil diperbarui! 🎉')
      router.push('/dashboard/undangan')
    } catch (err: any) {
      console.error('Update error:', err)
      toast.error(err.message || 'Gagal memperbarui undangan')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
      <Loader className="animate-spin" color="#E8627A" size={40} />
    </div>
  )

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Back nav */}
      <Link href="/dashboard/undangan" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#888', fontSize: 13, textDecoration: 'none', marginBottom: 20, fontWeight: 500 }}>
        <ArrowLeft size={14} /> Kembali ke Daftar Undangan
      </Link>

      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FDE8ED', borderRadius: 100, padding: '4px 12px', marginBottom: 10, fontSize: 12, color: '#E8627A', fontWeight: 600 }}>
            ✏️ Mode Edit
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Edit Undangan</h1>
          <p style={{ fontSize: 14, color: '#888' }}>Perbarui informasi undangan <strong>{form.event_name}</strong></p>
        </div>
        <Link href={`/undangan/${form.slug}`} target="_blank" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          border: '1.5px solid #f0f0f0', borderRadius: 100, padding: '9px 18px',
          fontSize: 13, fontWeight: 600, color: '#666', textDecoration: 'none', background: 'white',
        }}>
          👁️ Lihat Undangan
        </Link>
      </div>

      {/* Progress Steps */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36, gap: 0 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <button
                onClick={() => setStep(i)}
                style={{
                  width: 36, height: 36, borderRadius: '50%', border: '2px solid',
                  borderColor: i <= step ? '#E8627A' : '#f0f0f0',
                  background: i < step ? '#E8627A' : 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s', cursor: 'pointer',
                  boxShadow: i === step ? '0 0 0 4px rgba(232,98,122,0.15)' : 'none',
                }}
              >
                {i < step
                  ? <Check size={16} color="white" />
                  : <span style={{ fontSize: 13, fontWeight: 700, color: i === step ? '#E8627A' : '#ccc' }}>{i + 1}</span>
                }
              </button>
              <span style={{ fontSize: 10, fontWeight: 600, color: i <= step ? '#E8627A' : '#ccc', marginTop: 6, textAlign: 'center', whiteSpace: 'nowrap' }}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ height: 2, flex: 1, background: i < step ? '#E8627A' : '#f0f0f0', transition: 'background 0.3s', marginBottom: 20 }} />
            )}
          </div>
        ))}
      </div>

      {/* Content Card */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        style={{
          background: 'white', borderRadius: 20, padding: 32,
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1.5px solid #f0f0f0',
          minHeight: 320, marginBottom: 24,
        }}
      >
        {/* Step 0: Info Acara */}
        {step === 0 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Informasi Acara</h2>
            <p style={{ fontSize: 13, color: '#aaa', marginBottom: 28 }}>Perbarui jenis acara dan nama undangan</p>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 12 }}>Jenis Acara</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {EVENT_TYPES.map(e => (
                  <button key={e.id} onClick={() => update('event_type', e.id)} style={{
                    padding: '10px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    border: form.event_type === e.id ? '2px solid #E8627A' : '2px solid #f0f0f0',
                    background: form.event_type === e.id ? '#FDE8ED' : 'white',
                    color: form.event_type === e.id ? '#E8627A' : '#666',
                    transition: 'all 0.2s',
                  }}>
                    {e.emoji} {e.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Nama Undangan / Acara <span style={{ color: '#EF4444' }}>*</span></label>
              <input value={form.event_name} onChange={e => update('event_name', e.target.value)} className="input-elegant" required />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>URL Undangan</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #E8D5B0', borderRadius: 10, overflow: 'hidden', background: '#FAFAFA' }}>
                <span style={{ padding: '12px 14px', fontSize: 13, color: '#aaa', background: '#f5f5f5', borderRight: '1px solid #E8D5B0', whiteSpace: 'nowrap' }}>
                  eternalinvite.com/undangan/
                </span>
                <input value={form.slug} onChange={e => update('slug', e.target.value)}
                  style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 14px', fontSize: 13, background: 'transparent' }} />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Pasangan */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Informasi Pasangan / Tokoh</h2>
            <p style={{ fontSize: 13, color: '#aaa', marginBottom: 28 }}>Perbarui nama yang ditampilkan di undangan</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>
                  {form.event_type === 'wedding' ? 'Nama Pengantin Wanita' : 'Nama Utama'}
                </label>
                <input value={form.bride_name} onChange={e => update('bride_name', e.target.value)} className="input-elegant" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>
                  {form.event_type === 'wedding' ? 'Nama Pengantin Pria' : 'Nama Kedua (opsional)'}
                </label>
                <input value={form.groom_name} onChange={e => update('groom_name', e.target.value)} className="input-elegant" />
              </div>
            </div>

            {form.event_type === 'wedding' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Nama Ayah Mempelai Wanita</label>
                    <input value={form.bride_father_name} onChange={e => update('bride_father_name', e.target.value)} className="input-elegant" placeholder="Bapak [Nama]" />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Nama Ibu Mempelai Wanita</label>
                    <input value={form.bride_mother_name} onChange={e => update('bride_mother_name', e.target.value)} className="input-elegant" placeholder="Ibu [Nama]" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Nama Ayah Mempelai Pria</label>
                    <input value={form.groom_father_name} onChange={e => update('groom_father_name', e.target.value)} className="input-elegant" placeholder="Bapak [Nama]" />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Nama Ibu Mempelai Pria</label>
                    <input value={form.groom_mother_name} onChange={e => update('groom_mother_name', e.target.value)} className="input-elegant" placeholder="Ibu [Nama]" />
                  </div>
                </div>
              </>
            )}

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Kisah / Cerita</label>
              <textarea value={form.story} onChange={e => update('story', e.target.value)}
                rows={5} style={{ width: '100%', resize: 'vertical' }} className="input-elegant" />
            </div>
          </div>
        )}

        {/* Step 2: Detail Acara */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Detail Acara</h2>
            <p style={{ fontSize: 13, color: '#aaa', marginBottom: 28 }}>Perbarui waktu dan tempat acara</p>
            {form.event_type === 'wedding' && (
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#C9A96E', marginBottom: 16 }}>🕌 Akad Nikah</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Tanggal</label>
                    <input type="date" value={form.akad_date} onChange={e => update('akad_date', e.target.value)} className="input-elegant" />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Pukul</label>
                    <input type="time" value={form.akad_time} onChange={e => update('akad_time', e.target.value)} className="input-elegant" />
                  </div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Lokasi</label>
                  <input value={form.akad_location} onChange={e => update('akad_location', e.target.value)} className="input-elegant" />
                </div>
              </div>
            )}
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#E8627A', marginBottom: 16 }}>
                {form.event_type === 'wedding' ? '🎊 Resepsi' : '📅 Detail Acara'}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Tanggal <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="date" value={form.event_date} onChange={e => update('event_date', e.target.value)} className="input-elegant" />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Pukul</label>
                  <input type="time" value={form.reception_time} onChange={e => update('reception_time', e.target.value)} className="input-elegant" />
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Lokasi / Gedung</label>
                <input value={form.reception_location} onChange={e => update('reception_location', e.target.value)} className="input-elegant" />
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Link Google Maps (opsional)</label>
                <input value={form.location_url} onChange={e => update('location_url', e.target.value)} className="input-elegant" placeholder="https://maps.google.com/..." />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Tema & Musik */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Tema & Musik</h2>
            <p style={{ fontSize: 13, color: '#aaa', marginBottom: 28 }}>Ubah tampilan dan musik latar undangan</p>
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 16 }}>Pilih Tema Undangan</label>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {THEMES.map(t => (
                  <button key={t.id} onClick={() => update('theme', t.id)} style={{
                    padding: '12px 20px', borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    border: `2px solid ${form.theme === t.id ? t.color : '#f0f0f0'}`,
                    background: form.theme === t.id ? `${t.color}15` : 'white',
                    color: form.theme === t.id ? t.color : '#666',
                    transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span>{t.emoji}</span> {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>Musik Background</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: '#888' }}>{form.music_enabled ? 'Aktif' : 'Nonaktif'}</span>
                  <button onClick={() => update('music_enabled', !form.music_enabled)} style={{
                    width: 44, height: 24, borderRadius: 100, border: 'none', cursor: 'pointer',
                    background: form.music_enabled ? '#E8627A' : '#ddd', position: 'relative', transition: 'background 0.3s',
                  }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: form.music_enabled ? 23 : 3, transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                  </button>
                </div>
              </div>
              <input value={form.music_url} onChange={e => update('music_url', e.target.value)}
                placeholder="URL musik (contoh: https://example.com/music.mp3)"
                className="input-elegant" disabled={!form.music_enabled}
                style={{ opacity: form.music_enabled ? 1 : 0.5 }} />
            </div>
          </div>
        )}

        {/* Step 4: Simpan */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 80, marginBottom: 20 }}>✅</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>
              Siap Diperbarui!
            </h2>
            <p style={{ fontSize: 14, color: '#888', lineHeight: 1.8, maxWidth: 400, margin: '0 auto 24px' }}>
              Klik tombol di bawah untuk menyimpan semua perubahan undangan Anda.
            </p>
            {/* Summary */}
            <div style={{ background: '#FDF8F0', borderRadius: 14, padding: 20, textAlign: 'left', marginBottom: 28 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#C9A96E', marginBottom: 12 }}>Ringkasan Perubahan</h3>
              {[
                { label: 'Nama Acara', value: form.event_name || '—' },
                { label: 'URL', value: `eternalinvite.com/undangan/${form.slug || '—'}` },
                { label: 'Tanggal', value: form.event_date ? new Date(form.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
                { label: 'Tema', value: THEMES.find(t => t.id === form.theme)?.label || '—' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: '#aaa', width: 100, flexShrink: 0, fontWeight: 600 }}>{item.label}</span>
                  <span style={{ fontSize: 12, color: '#1a1a1a', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.value}</span>
                </div>
              ))}
            </div>
            <button onClick={handleSave} disabled={loading} className="btn-primary"
              style={{ fontSize: 15, padding: '14px 36px', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Menyimpan...</> : <><Save size={16} /> Simpan Perubahan</>}
            </button>
          </div>
        )}
      </motion.div>

      {/* Navigation Buttons */}
      {step < 4 && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 100, border: '1.5px solid #f0f0f0',
              background: 'white', cursor: step === 0 ? 'not-allowed' : 'pointer',
              fontSize: 14, fontWeight: 600, color: step === 0 ? '#ccc' : '#666',
            }}
          >
            <ArrowLeft size={16} /> Kembali
          </button>
          <button
            onClick={() => {
              if (step === 0 && !form.event_name) { toast.error('Nama acara harus diisi'); return }
              setStep(Math.min(4, step + 1))
            }}
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            Lanjut <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
