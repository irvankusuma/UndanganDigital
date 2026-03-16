'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Palette, Check, Image as ImageIcon, Music, MapPin, Eye, Save,
  Plus, X, ChevronDown, Upload, Info
} from 'lucide-react'
import toast from 'react-hot-toast'

const THEMES = [
  { id: 'elegant', label: 'Rose Elegance', color: '#E8627A', bg: 'linear-gradient(135deg, #FDE8ED, #FFF0F3)', emoji: '🌸', desc: 'Romantis & Elegan' },
  { id: 'minimalist', label: 'Gold Minimalist', color: '#C9A96E', bg: 'linear-gradient(135deg, #FDF8F0, #F5EDD8)', emoji: '✨', desc: 'Modern & Simpel' },
  { id: 'romantic', label: 'Garden Romance', color: '#10B981', bg: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', emoji: '🌿', desc: 'Segar & Alami' },
  { id: 'modern', label: 'Modern Chic', color: '#6366F1', bg: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', emoji: '💎', desc: 'Kontemporer' },
  { id: 'garden', label: 'Tropical Bloom', color: '#F59E0B', bg: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', emoji: '🌺', desc: 'Ceria & Tropis' },
]

const FONTS_TITLE = ['Playfair Display', 'Great Vibes', 'Dancing Script', 'Cormorant Garamond']
const FONTS_BODY = ['Poppins', 'Montserrat', 'Lato', 'Nunito']
const SECTIONS = ['Informasi Acara', 'Tema & Warna', 'Galeri Foto', 'Musik', 'Fitur', 'Pratinjau']

import { createClient } from '@/lib/supabase/client'

export default function KustomisasiPage() {
  const [activeSection, setActiveSection] = useState('Informasi Acara')
  const [loading, setLoading] = useState(true)
  const [currentInvId, setCurrentInvId] = useState<string | null>(null)
  
  const [selectedTheme, setSelectedTheme] = useState('elegant')
  const [selectedColor, setSelectedColor] = useState('#E8627A')
  const [fontTitle, setFontTitle] = useState('Playfair Display')
  const [fontBody, setFontBody] = useState('Poppins')
  const [musicEnabled, setMusicEnabled] = useState(false)
  
  const [features, setFeatures] = useState({
    rsvp: true, guestbook: true, gallery: true, gift: false, music: false, countdown: true,
  })
  const [gallery, setGallery] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  
  const [eventInfo, setEventInfo] = useState({
    date: '',
    time: '',
    location: '',
    address: '',
    mapUrl: '',
    greeting: '',
  })
  const [saving, setSaving] = useState(false)
  const theme = THEMES.find(t => t.id === selectedTheme) || THEMES[0]

  // Fetch real data
  useEffect(() => {
    const fetchInv = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: invs } = await supabase.from('invitations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)

        if (!invs || invs.length === 0) {
          setLoading(false)
          return
        }

        const inv = invs[0]
        setCurrentInvId(inv.id)
        
        // Populate state
        setSelectedTheme(inv.theme || 'elegant')
        setSelectedColor(inv.color_hex || '#E8627A')
        setFontTitle(inv.font_title || 'Playfair Display')
        setFontBody(inv.font_body || 'Poppins')
        
        setEventInfo({
          date: inv.event_date || '',
          time: inv.event_time || '',
          location: inv.location_name || '',
          address: inv.location_address || '',
          mapUrl: inv.location_map_url || '',
          greeting: inv.greeting_text || 'Dengan memohon rahmat dan ridha Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.',
        })
        
        if (inv.gallery_images && Array.isArray(inv.gallery_images)) {
          setGallery(inv.gallery_images)
        }
        
        setFeatures({
          rsvp: inv.enable_rsvp ?? true,
          guestbook: inv.enable_wishes ?? true,
          gallery: inv.enable_gallery ?? true,
          gift: inv.enable_gifts ?? false,
          music: inv.enable_music ?? false,
          countdown: inv.enable_countdown ?? true,
        })
        
        setMusicEnabled(inv.enable_music ?? false)

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchInv()
  }, [])

  const handleSave = async () => {
    if (!currentInvId) {
      toast.error('Gagal menyimpan. Undangan tidak ditemukan.')
      return
    }
    
    setSaving(true)
    try {
      const supabase = createClient()
      const payload = {
        theme: selectedTheme,
        color_hex: selectedColor,
        font_title: fontTitle,
        font_body: fontBody,
        event_date: eventInfo.date || null,
        event_time: eventInfo.time || null,
        location_name: eventInfo.location || null,
        location_address: eventInfo.address || null,
        location_map_url: eventInfo.mapUrl || null,
        greeting_text: eventInfo.greeting || null,
        gallery_images: gallery,
        enable_rsvp: features.rsvp,
        enable_wishes: features.guestbook,
        enable_gallery: features.gallery,
        enable_gifts: features.gift,
        enable_music: musicEnabled,
        enable_countdown: features.countdown,
      }
      
      const { error } = await supabase.from('invitations').update(payload).eq('id', currentInvId)
      if (error) throw error
      
      toast.success('Kustomisasi berhasil disimpan! 🎉')
    } catch (err) {
      console.error(err)
      toast.error('Gagal menyimpan kustomisasi')
    } finally {
      setSaving(false)
    }
  }

  const removePhoto = (idx: number) => setGallery(prev => prev.filter((_, i) => i !== idx))
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const supabase = createClient()

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${currentInvId}/${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `gallery/${fileName}`

        const { error: uploadError, data } = await supabase.storage
          .from('invitations')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('invitations')
          .getPublicUrl(filePath)

        setGallery(prev => [...prev, publicUrl])
      }
      toast.success('Foto berhasil diunggah! 📸')
    } catch (err) {
      console.error('Upload error:', err)
      toast.error('Gagal mengunggah foto. Pastikan bucket "invitations" sudah ada.')
    } finally {
      setUploading(false)
      // Reset input
      e.target.value = ''
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Kustomisasi Acara</h1>
          <p style={{ fontSize: 14, color: '#888' }}>Atur detail informasi, tema, dan galeri foto pernikahan Anda untuk undangan digital yang sempurna.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            border: '1.5px solid #f0f0f0', borderRadius: 100, padding: '10px 20px',
            fontSize: 13, fontWeight: 600, color: '#666', cursor: 'pointer', background: 'white',
          }}>
            <Eye size={15} /> Pratinjau
          </button>
          <button onClick={handleSave} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <Save size={15} /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, overflowX: 'auto', paddingBottom: 4 }}>
        {SECTIONS.map(s => (
          <button key={s} onClick={() => setActiveSection(s)} style={{
            padding: '9px 18px', borderRadius: 100, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.2s',
            background: activeSection === s ? 'linear-gradient(135deg, #E8627A, #C44A62)' : 'white',
            color: activeSection === s ? 'white' : '#666',
            boxShadow: activeSection === s ? '0 4px 16px rgba(232,98,122,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            {s}
          </button>
        ))}
      </div>
      
      {loading && <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Memuat data kustomisasi...</div>}
      
      {!loading && !currentInvId && (
        <div style={{ textAlign: 'center', padding: 40, background: 'white', borderRadius: 16, border: '1px solid #f0f0f0' }}>
          <h3>Belum ada undangan aktif</h3>
          <p style={{ color: '#888', marginTop: 8 }}>Buat undangan terlebih dahulu untuk membukanya di sini.</p>
        </div>
      )}

      {!loading && currentInvId && (
        <>
      {/* ── INFORMASI ACARA ── */}
      {activeSection === 'Informasi Acara' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1.5px solid #f0f0f0', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, color: '#E8627A', fontWeight: 700, fontSize: 15 }}>
              <Info size={18} /> Informasi Acara
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Tanggal Pernikahan</label>
                <input type="date" value={eventInfo.date} onChange={e => setEventInfo(p => ({ ...p, date: e.target.value }))} className="input-elegant" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Waktu Mulai</label>
                <input type="time" value={eventInfo.time} onChange={e => setEventInfo(p => ({ ...p, time: e.target.value }))} className="input-elegant" />
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Lokasi / Nama Venue</label>
              <input value={eventInfo.location} onChange={e => setEventInfo(p => ({ ...p, location: e.target.value }))} className="input-elegant" placeholder="The Ritz-Carlton, Mega Kuningan" />
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Alamat Lengkap</label>
              <textarea value={eventInfo.address} onChange={e => setEventInfo(p => ({ ...p, address: e.target.value }))} className="input-elegant" rows={3} style={{ resize: 'vertical' }} placeholder="Jl. ..." />
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>
                <MapPin size={14} style={{ display: 'inline', marginRight: 6 }} />Link Google Maps Embed
              </label>
              <input value={eventInfo.mapUrl} onChange={e => setEventInfo(p => ({ ...p, mapUrl: e.target.value }))} className="input-elegant" placeholder="https://maps.google.com/..." />
              {eventInfo.mapUrl && (
                <div style={{ marginTop: 12, borderRadius: 12, overflow: 'hidden', height: 220, border: '1px solid #f0f0f0' }}>
                  <iframe src={eventInfo.mapUrl} width="100%" height="100%" style={{ border: 0 }} loading="lazy" />
                </div>
              )}
              {!eventInfo.mapUrl && (
                <div style={{ marginTop: 12, borderRadius: 12, height: 120, background: 'linear-gradient(135deg, #f8f8f8, #f0f0f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, border: '1px dashed #ddd', cursor: 'pointer' }}>
                  <MapPin size={24} color="#ccc" />
                  <span style={{ fontSize: 12, color: '#aaa' }}>PREVIEW LOKASI PETA</span>
                </div>
              )}
            </div>
            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Teks Sambutan Undangan</label>
              <textarea value={eventInfo.greeting} onChange={e => setEventInfo(p => ({ ...p, greeting: e.target.value }))} className="input-elegant" rows={3} style={{ resize: 'vertical' }} />
            </div>
          </div>
        </motion.div>
      )}

      {/* ── TEMA & WARNA ── */}
      {activeSection === 'Tema & Warna' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1.5px solid #f0f0f0', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, color: '#E8627A', fontWeight: 700, fontSize: 15 }}>
              <Palette size={18} /> Tema & Warna
            </div>

            {/* Theme Cards */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 16 }}>Pilih Tema Undangan</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 14 }}>
                {THEMES.map(t => (
                  <motion.button
                    key={t.id}
                    whileHover={{ y: -3 }}
                    onClick={() => { setSelectedTheme(t.id); setSelectedColor(t.color) }}
                    style={{
                      borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
                      border: `2px solid ${selectedTheme === t.id ? t.color : '#f0f0f0'}`,
                      boxShadow: selectedTheme === t.id ? `0 4px 20px ${t.color}30` : 'none',
                      background: 'white', padding: 0,
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ height: 80, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, position: 'relative' }}>
                      {t.emoji}
                      {selectedTheme === t.id && (
                        <div style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={11} color="white" />
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '10px 12px', textAlign: 'left' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a' }}>{t.label}</div>
                      <div style={{ fontSize: 10, color: '#aaa', marginTop: 2 }}>{t.desc}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 12 }}>Pilih Warna Utama</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                {['#E8627A', '#F97316', '#8B5CF6', '#10B981', '#F59E0B', '#6366F1'].map(c => (
                  <button key={c} onClick={() => setSelectedColor(c)} style={{
                    width: 36, height: 36, borderRadius: '50%', background: c, border: 'none', cursor: 'pointer',
                    boxShadow: selectedColor === c ? `0 0 0 3px white, 0 0 0 5px ${c}` : 'none',
                    transition: 'box-shadow 0.2s',
                  }} />
                ))}
                <input type="color" value={selectedColor} onChange={e => setSelectedColor(e.target.value)}
                  style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #f0f0f0', cursor: 'pointer', padding: 2 }} />
              </div>
            </div>

            {/* Font Selection */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Pilih Font Judul</label>
                <select value={fontTitle} onChange={e => setFontTitle(e.target.value)} className="input-elegant">
                  {FONTS_TITLE.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <div style={{ marginTop: 12, padding: '12px 16px', background: '#FDF8F0', borderRadius: 10, textAlign: 'center' }}>
                  <p style={{ fontFamily: `${fontTitle}, serif`, fontSize: 20, color: selectedColor, margin: 0 }}>
                    The Wedding of Andi & Sarah
                  </p>
                  <p style={{ fontSize: 10, color: '#aaa', marginTop: 4 }}>PREVIEW FONT JUDUL</p>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Pilih Font Isi</label>
                <select value={fontBody} onChange={e => setFontBody(e.target.value)} className="input-elegant">
                  {FONTS_BODY.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <div style={{ marginTop: 12, padding: '12px 16px', background: '#FDF8F0', borderRadius: 10 }}>
                  <p style={{ fontFamily: `${fontBody}, sans-serif`, fontSize: 13, color: '#555', margin: 0, lineHeight: 1.7 }}>
                    Kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara spesial kami.
                  </p>
                  <p style={{ fontSize: 10, color: '#aaa', marginTop: 4 }}>PREVIEW FONT ISI</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── GALERI FOTO ── */}
      {activeSection === 'Galeri Foto' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1.5px solid #f0f0f0', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#E8627A', fontWeight: 700, fontSize: 15 }}>
                <ImageIcon size={18} /> Galeri Foto
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="file"
                  id="gallery-upload"
                  multiple
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
                <label 
                  htmlFor="gallery-upload"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    border: '1.5px solid #E8627A', borderRadius: 100, padding: '8px 16px',
                    fontSize: 12, fontWeight: 600, color: '#E8627A', cursor: 'pointer', background: '#FDE8ED',
                    opacity: uploading ? 0.6 : 1
                  }}
                >
                  <Plus size={13} /> {uploading ? 'Mengunggah...' : 'Tambah Foto'}
                </label>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
              {gallery.map((img, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '1/1' }}>
                  <img src={img} alt={`Gallery ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <button onClick={() => removePhoto(i)} style={{
                    position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <X size={14} />
                  </button>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.5))', padding: '20px 10px 8px' }}>
                    <span style={{ fontSize: 10, color: 'white', fontWeight: 600 }}>Foto {i + 1}</span>
                  </div>
                </motion.div>
              ))}
              {/* Upload placeholder */}
              <label 
                htmlFor="gallery-upload"
                style={{
                  borderRadius: 12, border: '2px dashed #E8D5B0', aspectRatio: '1/1',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                  cursor: 'pointer', background: '#FFFBF0', transition: 'all 0.2s',
                  position: 'relative',
                  opacity: uploading ? 0.6 : 1
                }}
              >
                {uploading ? (
                  <div className="animate-spin" style={{ fontSize: 24 }}>⏳</div>
                ) : (
                  <Upload size={24} color="#C9A96E" />
                )}
                <span style={{ fontSize: 11, color: '#C9A96E', fontWeight: 600 }}>
                  {uploading ? 'Mengunggah...' : 'Upload Baru'}
                </span>
              </label>
            </div>
            <div style={{ marginTop: 16, background: '#FDE8ED', borderRadius: 10, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <Info size={14} color="#E8627A" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: '#C44A62', lineHeight: 1.7 }}>
                💡 Gunakan foto dengan kualitas tinggi (HD) dan aspek rasio yang konsisten untuk hasil galeri yang lebih cantik. Maksimal ukuran file adalah 5MB per foto.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── MUSIK ── */}
      {activeSection === 'Musik' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1.5px solid #f0f0f0', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#E8627A', fontWeight: 700, fontSize: 15 }}>
                <Music size={18} /> Musik Background
              </div>
              <button onClick={() => setMusicEnabled(!musicEnabled)} style={{
                width: 52, height: 28, borderRadius: 100, border: 'none', cursor: 'pointer',
                background: musicEnabled ? '#E8627A' : '#ddd', position: 'relative', transition: 'background 0.3s',
              }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 4, left: musicEnabled ? 28 : 4, transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
              </button>
            </div>

            {musicEnabled ? (
              <>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>URL Musik</label>
                  <input className="input-elegant" placeholder="https://example.com/music.mp3 atau URL YouTube" />
                  <p style={{ fontSize: 12, color: '#aaa', marginTop: 6 }}>Mendukung format MP3, OGG, dan WAV. Atau tempel URL YouTube untuk streaming.</p>
                </div>
                <div style={{ padding: 20, background: '#FDF8F0', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #E8627A, #C44A62)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Music size={18} color="white" />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>♫ Wedding Song</div>
                    <div style={{ fontSize: 12, color: '#888' }}>Musik akan otomatis terputar saat undangan dibuka (setelah interaksi pengguna)</div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: '#FAFAFA', borderRadius: 12, border: '1px dashed #eee' }}>
                <Music size={40} color="#ddd" style={{ margin: '0 auto 16px' }} />
                <div style={{ fontSize: 15, fontWeight: 600, color: '#aaa', marginBottom: 6 }}>Musik Nonaktif</div>
                <div style={{ fontSize: 13, color: '#ccc' }}>Aktifkan toggle di atas untuk menambahkan musik latar undangan.</div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ── FITUR ── */}
      {activeSection === 'Fitur' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1.5px solid #f0f0f0', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Fitur Halaman Undangan</h3>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>Pilih fitur yang ingin ditampilkan di halaman undangan tamu Anda.</p>
            {[
              { key: 'countdown', label: 'Hitung Mundur', desc: 'Timer countdown menuju hari acara', icon: '⏱️' },
              { key: 'rsvp', label: 'RSVP Konfirmasi', desc: 'Form konfirmasi kehadiran tamu', icon: '✅' },
              { key: 'guestbook', label: 'Buku Tamu', desc: 'Tamu dapat menulis ucapan dan doa', icon: '📖' },
              { key: 'gallery', label: 'Galeri Foto', desc: 'Tampilkan foto-foto indah di undangan', icon: '🖼️' },
              { key: 'gift', label: 'Hadiah Digital', desc: 'Tampilkan info rekening untuk hadiah', icon: '🎁' },
              { key: 'music', label: 'Musik Background', desc: 'Putar musik latar saat undangan dibuka', icon: '🎵' },
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 18, borderBottom: '1px solid #f5f5f5', marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: '#FDE8ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: '#aaa' }}>{item.desc}</div>
                  </div>
                </div>
                <button
                  onClick={() => setFeatures(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                  style={{
                    width: 52, height: 28, borderRadius: 100, border: 'none', cursor: 'pointer',
                    background: features[item.key as keyof typeof features] ? '#E8627A' : '#ddd',
                    position: 'relative', transition: 'background 0.3s',
                  }}
                >
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 4, left: features[item.key as keyof typeof features] ? 28 : 4, transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── PRATINJAU ── */}
      {activeSection === 'Pratinjau' && !loading && currentInvId && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1.5px solid #f0f0f0', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>Pratinjau Undangan</h3>
              <a href="/undangan/andi-sarah" target="_blank" style={{ fontSize: 13, color: '#E8627A', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Eye size={14} /> Buka Full Preview
              </a>
            </div>
            {/* Mini phone frame */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 280, height: 520, borderRadius: 36, border: '8px solid #1a1a1a', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 80, height: 22, background: '#1a1a1a', borderRadius: '0 0 14px 14px', zIndex: 10 }} />
                <div style={{ height: '100%', background: theme.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '44px 20px 20px', overflow: 'hidden' }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>🌸</div>
                  <p style={{ fontSize: 8, letterSpacing: 3, color: theme.color, textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>THE WEDDING OF</p>
                  <h2 style={{ fontFamily: `${fontTitle}, serif`, fontSize: 22, fontWeight: 700, color: '#1a1a1a', textAlign: 'center', marginBottom: 4 }}>Andi & Sarah</h2>
                  <div style={{ width: 40, height: 1.5, background: theme.color, margin: '8px 0' }} />
                  <p style={{ fontSize: 9, color: '#888', marginBottom: 4 }}>Sabtu, 25 Desember 2024</p>
                  <p style={{ fontSize: 8, color: '#aaa', textAlign: 'center', marginBottom: 12 }}>The Ritz-Carlton, Mega Kuningan</p>
                  {/* Countdown mini */}
                  <div style={{ background: 'white', borderRadius: 10, padding: '8px 16px', display: 'flex', gap: 12, marginBottom: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    {[['42', 'Hari'], ['08', 'Jam'], ['24', 'Mnt']].map(([n, l]) => (
                      <div key={l} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: theme.color }}>{n}</div>
                        <div style={{ fontSize: 7, color: '#aaa' }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <button style={{ background: `linear-gradient(135deg, ${theme.color}, ${theme.color}cc)`, color: 'white', border: 'none', borderRadius: 100, padding: '8px 20px', fontSize: 10, fontWeight: 700, cursor: 'pointer', width: '100%', boxShadow: `0 4px 12px ${theme.color}50` }}>
                    RSVP SEKARANG
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Save Bar */}
      {!loading && currentInvId && (
        <div style={{ position: 'sticky', bottom: 24, display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 40 }}>
          <button style={{ padding: '12px 24px', borderRadius: 100, border: '1.5px solid #f0f0f0', background: 'white', cursor: 'pointer', fontWeight: 600, color: '#666', fontSize: 14 }}>Batalkan</button>
          <button onClick={handleSave} className="btn-primary" disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, padding: '12px 28px', opacity: saving ? 0.7 : 1 }}>
            <Save size={15} /> {saving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
          </button>
        </div>
      )}
      </>
      )}
    </div>
  )
}
