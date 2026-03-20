'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Loader, Plus, Trash2, MapPin, Music, Image as ImageIcon, Gift, Palette } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

const STEPS = ['Info Acara', 'Pasangan', 'Detail Acara', 'Hadiah', 'Galeri', 'Tema & Musik', 'Selesai']

const THEMES = [
  { id: 'elegant', label: 'Rose Elegance', color: '#E8627A', emoji: '🌸', preview: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&q=80' },
  { id: 'minimalist', label: 'Gold Minimalist', color: '#C9A96E', emoji: '✨', preview: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&q=80' },
  { id: 'romantic', label: 'Garden Romance', color: '#10B981', emoji: '🌿', preview: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=300&q=80' },
  { id: 'modern', label: 'Modern Chic', color: '#6366F1', emoji: '💎', preview: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=300&q=80' },
  { id: 'garden', label: 'Tropical Bloom', color: '#F59E0B', emoji: '🌺', preview: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=300&q=80' },
]

const EVENT_TYPES = [
  { id: 'wedding', label: 'Pernikahan', emoji: '💍' },
  { id: 'birthday', label: 'Ulang Tahun', emoji: '🎂' },
  { id: 'family', label: 'Acara Keluarga', emoji: '👨‍👩‍👧‍👦' },
  { id: 'seminar', label: 'Seminar/Event', emoji: '🎤' },
  { id: 'other', label: 'Lainnya', emoji: '🎉' },
]

const BANKS = ['BCA', 'Mandiri', 'BNI', 'BRI', 'CIMB', 'Dana', 'GoPay', 'OVO', 'ShopeePay', 'LinkAja']

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').trim()
}

export default function CreateInvitationPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [savedAccounts, setSavedAccounts] = useState<any[]>([])
  
  const [form, setForm] = useState<any>({
    event_name: '',
    event_type: 'wedding',
    slug: '',
    bride_name: '',
    groom_name: '',
    event_date: '',
    akad_date: '',
    akad_time: '',
    akad_location: '',
    akad_location_url: '',
    reception_date: '',
    reception_time: '',
    reception_location: '',
    location_url: '',
    story: '',
    theme: 'elegant',
    music_url: '',
    music_enabled: false,
    description: '',
    bride_father_name: '',
    bride_mother_name: '',
    groom_father_name: '',
    groom_mother_name: '',
    bride_child_order: '',
    groom_child_order: '',
    bride_father_is_deceased: false,
    bride_mother_is_deceased: false,
    groom_father_is_deceased: false,
    groom_mother_is_deceased: false,
    bride_photo: '',
    groom_photo: '',
    gallery: [] as string[],
    gifts: [] as any[],
  })

  // Persistence: Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('invitation_draft')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setForm((prev: any) => ({ ...prev, ...parsed }))
      } catch (e) {
        console.error('Error loading draft', e)
      }
    }

    // Fetch saved accounts
    const fetchSavedAccounts = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('saved_payment_methods').select('*').eq('user_id', user.id)
        setSavedAccounts(data || [])
      }
    }
    fetchSavedAccounts()
  }, [])

  // Auto-save on change
  useEffect(() => {
    localStorage.setItem('invitation_draft', JSON.stringify(form))
  }, [form])

  const update = (field: string, value: unknown) => {
    setForm((prev: any) => {
      const updated = { ...prev, [field]: value }
      if (field === 'event_name' && !prev.slug) updated.slug = slugify(value as string)
      return updated
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const supabase = createClient()
    const newGallery = [...form.gallery]

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Silakan login kembali')

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}-${i}.${fileExt}`
        
        const { error: uploadError, data } = await supabase.storage
          .from('gallery')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(fileName)
        newGallery.push(publicUrl)
      }

      update('gallery', newGallery)
      toast.success(`${files.length} foto berhasil diunggah`)
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengunggah foto')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newGallery = form.gallery.filter((_: any, i: number) => i !== index)
    update('gallery', newGallery)
  }

  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'bride' | 'groom') => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const supabase = createClient()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Silakan login kembali')

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/profile-${type}-${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage.from('gallery').upload(fileName, file)
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(fileName)
      update(type === 'bride' ? 'bride_photo' : 'groom_photo', publicUrl)
      toast.success('Foto profil berhasil diunggah')
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengunggah foto profil')
    } finally {
      setUploading(false)
    }
  }

  const addGiftAccount = (saved: any = null) => {
    if (saved) {
      if (form.gifts.some((g: any) => g.account_number === saved.account_number)) {
        toast.error('Rekening ini sudah ditambahkan')
        return
      }
      update('gifts', [...form.gifts, { ...saved }])
    } else {
      update('gifts', [...form.gifts, { bank_name: '', account_number: '', account_name: '', is_new: true }])
    }
  }

  const updateGiftAccount = (index: number, field: string, value: string) => {
    const newGifts = [...form.gifts]
    newGifts[index] = { ...newGifts[index], [field]: value }
    update('gifts', newGifts)
  }

  const removeGiftAccount = (index: number) => {
    update('gifts', form.gifts.filter((_: any, i: number) => i !== index))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Anda harus login terlebih dahulu')

      // 1. Create Invitation
      const sanitizedData = {
        user_id: user.id,
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
        akad_location_url: form.akad_location_url || null,
        description: form.description || null,
        theme: form.theme,
        music_url: form.music_url || null,
        music_enabled: form.music_enabled,
        bride_father_name: form.bride_father_name || null,
        bride_mother_name: form.bride_mother_name || null,
        groom_father_name: form.groom_father_name || null,
        groom_mother_name: form.groom_mother_name || null,
        bride_child_order: form.bride_child_order || null,
        groom_child_order: form.groom_child_order || null,
        bride_father_is_deceased: form.bride_father_is_deceased,
        bride_mother_is_deceased: form.bride_mother_is_deceased,
        groom_father_is_deceased: form.groom_father_is_deceased,
        groom_mother_is_deceased: form.groom_mother_is_deceased,
        bride_photo: form.bride_photo || null,
        groom_photo: form.groom_photo || null,
        gallery_images: form.gallery,
        gift_enabled: form.gifts.length > 0,
        status: 'draft',
      }

      const { data: inv, error } = await supabase.from('invitations').insert(sanitizedData).select().single()
      
      if (error) throw error

      // 2. Insert Gallery items (if separate table used)
      if (form.gallery.length > 0) {
        const galleryPayload = form.gallery.map((url: string, idx: number) => ({
          invitation_id: inv.id,
          image_url: url,
          order_index: idx
        }))
        await supabase.from('gallery').insert(galleryPayload)
      }

      // 3. Insert Gift Accounts
      if (form.gifts.length > 0) {
        const giftPayload = form.gifts.map((g: any) => ({
          invitation_id: inv.id,
          bank_name: g.bank_name,
          account_number: g.account_number,
          account_name: g.account_name
        }))
        await supabase.from('gift_accounts').insert(giftPayload)
        
        // Save new accounts to saved_payment_methods for future use
        const newOnes = form.gifts.filter((g: any) => g.is_new)
        if (newOnes.length > 0) {
          const savedPayload = newOnes.map((g: any) => ({
            user_id: user.id,
            bank_name: g.bank_name,
            account_number: g.account_number,
            account_name: g.account_name
          }))
          await supabase.from('saved_payment_methods').insert(savedPayload)
        }
      }

      localStorage.removeItem('invitation_draft')
      toast.success('Undangan berhasil dibuat! 🎉')
      router.push('/dashboard/undangan')
    } catch (err: any) {
      toast.error(err.message || 'Gagal membuat undangan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 840, margin: '0 auto', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Buat Undangan Baru</h1>
        <p style={{ fontSize: 14, color: '#888' }}>Ikuti langkah-langkah mudah di bawah untuk menyusun undangan Anda.</p>
      </div>

      {/* Progress Steps */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40, overflowX: 'auto', paddingBottom: 10, gap: 0 }} className="hide-scrollbar">
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 80 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', border: '2px solid',
                borderColor: i <= step ? '#E8627A' : '#f0f0f0',
                background: i < step ? '#E8627A' : 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s', boxShadow: i === step ? '0 0 0 4px rgba(232,98,122,0.1)' : 'none',
              }}>
                {i < step ? <Check size={14} color="white" /> : <span style={{ fontSize: 11, fontWeight: 700, color: i === step ? '#E8627A' : '#ccc' }}>{i + 1}</span>}
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, color: i <= step ? '#E8627A' : '#ccc', marginTop: 6, textAlign: 'center' }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: 30, height: 2, background: i < step ? '#E8627A' : '#f0f0f0', marginBottom: 16 }} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          style={{
            background: 'white', borderRadius: 24, padding: 36,
            boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1.5px solid #f0f0f0',
            minHeight: 400, marginBottom: 24,
          }}
        >
          {/* Step 0: Info Acara */}
          {step === 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <div style={{ padding: 10, background: '#FDE8ED', borderRadius: 12, color: '#E8627A' }}><Palette size={20} /></div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>Informasi Dasar</h2>
                  <p style={{ fontSize: 13, color: '#aaa' }}>Berikan judul dan tentukan link unik undangan Anda</p>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label className="label-elegant">Jenis Acara</label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {EVENT_TYPES.map(e => (
                    <button key={e.id} onClick={() => update('event_type', e.id)} style={{
                      padding: '10px 18px', borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      border: '2px solid', borderColor: form.event_type === e.id ? '#E8627A' : '#f0f0f0',
                      background: form.event_type === e.id ? '#FDE8ED' : 'white',
                      color: form.event_type === e.id ? '#E8627A' : '#666', transition: 'all 0.2s',
                    }}>{e.emoji} {e.label}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label className="label-elegant">Nama Undangan <span style={{ color: '#EF4444' }}>*</span></label>
                <input value={form.event_name} onChange={e => update('event_name', e.target.value)} placeholder="Andi & Sarah / Milad ke-5 Budi" className="input-elegant" required />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label className="label-elegant">URL / Link Undangan</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #E8D5B0', borderRadius: 12, overflow: 'hidden' }}>
                  <span style={{ padding: '12px 14px', fontSize: 13, color: '#aaa', background: '#FAFAFA' }}>eternalinvite.com/</span>
                  <input value={form.slug} onChange={e => update('slug', e.target.value)} placeholder="andi-sarah" style={{ flex: 1, border: 'none', padding: '12px 14px', fontSize: 13 }} />
                </div>
              </div>

              <div>
                <label className="label-elegant">Deskripsi Singkat</label>
                <textarea value={form.description} onChange={e => update('description', e.target.value)} placeholder="Mohon doa restu..." rows={3} className="input-elegant" style={{ resize: 'none' }} />
              </div>
            </div>
          )}

          {/* Step 1: Pasangan */}
          {step === 1 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <div style={{ padding: 10, background: '#F0F9FF', borderRadius: 12, color: '#0EA5E9' }}>💍</div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>Informasi Pasangan</h2>
                  <p style={{ fontSize: 13, color: '#aaa' }}>Detail tokoh utama dalam acara ini</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                {/* Groom Section (Pria) first */}
                <div style={{ padding: 20, background: '#FAFAFA', borderRadius: 16, border: '1px solid #eee' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
                    {form.event_type === 'wedding' ? '👨 Pengantin Pria' : '👤 Nama Utama'}
                  </h3>
                  
                  {/* Photo Upload */}
                  <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#eee', overflow: 'hidden', border: '2px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      {form.groom_photo ? <img src={form.groom_photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}><ImageIcon size={24} /></div>}
                    </div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#0EA5E9', cursor: 'pointer', padding: '6px 12px', background: '#F0F9FF', borderRadius: 100 }}>
                      {uploading ? 'Mengunggah...' : 'Pilih Foto'}
                      <input type="file" hidden accept="image/*" onChange={(e) => handleProfilePhotoUpload(e, 'groom')} disabled={uploading} />
                    </label>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <label className="label-elegant">Nama Lengkap</label>
                    <input value={form.groom_name} onChange={e => update('groom_name', e.target.value)} placeholder="Cth: Andi Pratama" className="input-elegant" />
                  </div>
                  
                  {form.event_type === 'wedding' && (
                    <>
                      <div style={{ marginBottom: 12 }}>
                        <label className="label-elegant">Putra Ke-</label>
                        <input value={form.groom_child_order} onChange={e => update('groom_child_order', e.target.value)} placeholder="Cth: Pertama / Kedua / Ke-3" className="input-elegant" />
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <label className="label-elegant" style={{ marginBottom: 0 }}>Nama Ayah</label>
                          <label style={{ fontSize: 12, color: '#666', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                            <input type="checkbox" checked={form.groom_father_is_deceased} onChange={e => update('groom_father_is_deceased', e.target.checked)} /> (Alm)
                          </label>
                        </div>
                        <input value={form.groom_father_name} onChange={e => update('groom_father_name', e.target.value)} placeholder="Bapak [Nama]" className="input-elegant" />
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <label className="label-elegant" style={{ marginBottom: 0 }}>Nama Ibu</label>
                          <label style={{ fontSize: 12, color: '#666', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                            <input type="checkbox" checked={form.groom_mother_is_deceased} onChange={e => update('groom_mother_is_deceased', e.target.checked)} /> (Almh)
                          </label>
                        </div>
                        <input value={form.groom_mother_name} onChange={e => update('groom_mother_name', e.target.value)} placeholder="Ibu [Nama]" className="input-elegant" />
                      </div>
                    </>
                  )}
                </div>

                {/* Bride Section (Wanita) second */}
                <div style={{ padding: 20, background: '#FFF1F2', borderRadius: 16, border: '1px solid #FDE8ED' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#E11D48', marginBottom: 16 }}>
                    {form.event_type === 'wedding' ? '👩 Pengantin Wanita' : '👤 Nama Kedua (Opsional)'}
                  </h3>
                  
                  {/* Photo Upload */}
                  <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#eee', overflow: 'hidden', border: '2px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      {form.bride_photo ? <img src={form.bride_photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}><ImageIcon size={24} /></div>}
                    </div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#E8627A', cursor: 'pointer', padding: '6px 12px', background: 'white', borderRadius: 100 }}>
                      {uploading ? 'Mengunggah...' : 'Pilih Foto'}
                      <input type="file" hidden accept="image/*" onChange={(e) => handleProfilePhotoUpload(e, 'bride')} disabled={uploading} />
                    </label>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <label className="label-elegant">Nama Lengkap</label>
                    <input value={form.bride_name} onChange={e => update('bride_name', e.target.value)} placeholder="Cth: Sarah Wijaya" className="input-elegant" />
                  </div>
                  
                  {form.event_type === 'wedding' && (
                    <>
                      <div style={{ marginBottom: 12 }}>
                        <label className="label-elegant">Putri Ke-</label>
                        <input value={form.bride_child_order} onChange={e => update('bride_child_order', e.target.value)} placeholder="Cth: Pertama / Kedua / Ke-3" className="input-elegant" />
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <label className="label-elegant" style={{ marginBottom: 0 }}>Nama Ayah</label>
                          <label style={{ fontSize: 12, color: '#666', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                            <input type="checkbox" checked={form.bride_father_is_deceased} onChange={e => update('bride_father_is_deceased', e.target.checked)} /> (Alm)
                          </label>
                        </div>
                        <input value={form.bride_father_name} onChange={e => update('bride_father_name', e.target.value)} placeholder="Bapak [Nama]" className="input-elegant" />
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <label className="label-elegant" style={{ marginBottom: 0 }}>Nama Ibu</label>
                          <label style={{ fontSize: 12, color: '#666', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                            <input type="checkbox" checked={form.bride_mother_is_deceased} onChange={e => update('bride_mother_is_deceased', e.target.checked)} /> (Almh)
                          </label>
                        </div>
                        <input value={form.bride_mother_name} onChange={e => update('bride_mother_name', e.target.value)} placeholder="Ibu [Nama]" className="input-elegant" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="label-elegant">Kisah / Cerita Singkat</label>
                <textarea value={form.story} onChange={e => update('story', e.target.value)} placeholder="Menceritakan pertemuan pertama..." rows={6} className="input-elegant" style={{ resize: 'none' }} />
              </div>
            </div>
          )}

          {/* Step 2: Detail Acara */}
          {step === 2 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <div style={{ padding: 10, background: '#F0FDF4', borderRadius: 12, color: '#10B981' }}><MapPin size={20} /></div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>Waktu & Lokasi</h2>
                  <p style={{ fontSize: 13, color: '#aaa' }}>Kapan dan di mana acara akan diselenggarakan</p>
                </div>
              </div>

              {form.event_type === 'wedding' && (
                <div style={{ marginBottom: 32, padding: 20, background: '#FAFAFA', borderRadius: 16, border: '1px solid #eee' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#C9A96E', marginBottom: 16 }}>🕌 Akad Nikah</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <input type="date" value={form.akad_date} onChange={e => update('akad_date', e.target.value)} className="input-elegant" />
                    <input type="time" value={form.akad_time} onChange={e => update('akad_time', e.target.value)} className="input-elegant" />
                  </div>
                  <input value={form.akad_location} onChange={e => update('akad_location', e.target.value)} placeholder="Nama Gedung / Tempat" className="input-elegant" style={{ marginBottom: 12 }} />
                  <input value={form.akad_location_url} onChange={e => update('akad_location_url', e.target.value)} placeholder="Link Google Maps (Penting untuk navigasi tamu)" className="input-elegant" />
                </div>
              )}

              <div style={{ padding: 20, background: '#FFF7F9', borderRadius: 16, border: '1px solid #FDE8ED' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#E8627A', marginBottom: 16 }}>
                  {form.event_type === 'wedding' ? '🎊 Resepsi' : '📅 Detail Utama Acara'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <input type="date" value={form.event_date} onChange={e => update('event_date', e.target.value)} className="input-elegant" />
                  <input type="time" value={form.reception_time} onChange={e => update('reception_time', e.target.value)} className="input-elegant" />
                </div>
                <input value={form.reception_location} onChange={e => update('reception_location', e.target.value)} placeholder="Nama Gedung / Tempat" className="input-elegant" style={{ marginBottom: 12 }} />
                <input value={form.location_url} onChange={e => update('location_url', e.target.value)} placeholder="Link Google Maps" className="input-elegant" />
              </div>
            </div>
          )}

          {/* Step 3: Hadiah */}
          {step === 3 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <div style={{ padding: 10, background: '#F5F3FF', borderRadius: 12, color: '#7C3AED' }}><Gift size={20} /></div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>Hadiah Digital</h2>
                  <p style={{ fontSize: 13, color: '#aaa' }}>Tambahkan nomor rekening atau e-wallet untuk kado digital</p>
                </div>
              </div>

              {savedAccounts.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <label className="label-elegant">Pilih dari Rekening Tersimpan</label>
                  <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 10 }} className="hide-scrollbar">
                    {savedAccounts.map(a => (
                      <button key={a.id} onClick={() => addGiftAccount(a)} style={{
                        padding: '10px 16px', background: 'white', border: '1.5px solid #eee', borderRadius: 12,
                        flexShrink: 0, textAlign: 'left', minWidth: 140, transition: 'all 0.2s', cursor: 'pointer'
                      }} className="hover-lift">
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#E8627A' }}>{a.bank_name}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#444' }}>{a.account_number}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {form.gifts.map((g: any, i: number) => (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} key={i} style={{ padding: 20, border: '1.5px solid #f0f0f0', borderRadius: 16, position: 'relative' }}>
                    <button onClick={() => removeGiftAccount(i)} style={{ position: 'absolute', top: 12, right: 12, color: '#EF4444', border: 'none', background: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 12 }}>
                      <select value={g.bank_name} onChange={e => updateGiftAccount(i, 'bank_name', e.target.value)} className="input-elegant">
                        <option value="">Pilih</option>
                        {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                      <input value={g.account_number} onChange={e => updateGiftAccount(i, 'account_number', e.target.value)} placeholder="No. Rekening" className="input-elegant" />
                      <input value={g.account_name} onChange={e => updateGiftAccount(i, 'account_name', e.target.value)} placeholder="Atas Nama" className="input-elegant" />
                    </div>
                  </motion.div>
                ))}
                <button onClick={() => addGiftAccount()} style={{
                  padding: '14px', border: '2px dashed #ddd', borderRadius: 16, background: 'none',
                  color: '#888', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                }} className="hover-lift"><Plus size={16} /> Tambah Rekening Baru</button>
              </div>
            </div>
          )}

          {/* Step 4: Galeri */}
          {step === 4 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <div style={{ padding: 10, background: '#FFF1F2', borderRadius: 12, color: '#E11D48' }}><ImageIcon size={20} /></div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>Galeri Foto</h2>
                  <p style={{ fontSize: 13, color: '#aaa' }}>Unggah momen terbaik Anda untuk ditampilkan (JPG/PNG)</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
                {form.gallery.map((url: string, i: number) => (
                  <div key={i} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 12, overflow: 'hidden', border: '1px solid #eee' }}>
                    <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}><Trash2 size={12} /></button>
                  </div>
                ))}
                
                <label style={{
                  aspectRatio: '1/1', border: '2px dashed #ddd', borderRadius: 12, display: 'flex', flexDirection: 'column', 
                  alignItems: 'center', justifyContent: 'center', cursor: uploading ? 'not-allowed' : 'pointer', background: '#FAFAFA'
                }} className="hover-lift">
                  {uploading ? <Loader size={20} className="animate-spin" color="#aaa" /> : <><Plus color="#ccc" /><span style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Unggah</span></>}
                  <input type="file" hidden multiple accept="image/jpeg,image/png" onChange={handleFileUpload} disabled={uploading} />
                </label>
              </div>
            </div>
          )}

          {/* Step 5: Tema & Musik */}
          {step === 5 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <div style={{ padding: 10, background: '#FFFBEB', borderRadius: 12, color: '#D97706' }}><Music size={20} /></div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>Tema & Musik</h2>
                  <p style={{ fontSize: 13, color: '#aaa' }}>Sesuaikan suasana undangan Anda</p>
                </div>
              </div>

              <div style={{ marginBottom: 32 }}>
                <label className="label-elegant">Pilih Tema</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                  {THEMES.map(t => (
                    <button key={t.id} onClick={() => update('theme', t.id)} style={{
                      padding: 12, borderRadius: 16, cursor: 'pointer', border: '2px solid',
                      borderColor: form.theme === t.id ? t.color : '#f0f0f0', background: 'white',
                      textAlign: 'left', transition: 'all 0.2s'
                    }} className="hover-lift">
                      <div style={{ aspectRatio: '16/9', borderRadius: 8, overflow: 'hidden', marginBottom: 10, border: '1px solid #eee' }}>
                        <img src={t.preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#444' }}>{t.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <label className="label-elegant">Musik Latar (YouTube Link)</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.music_enabled} onChange={e => update('music_enabled', e.target.checked)} />
                    <span style={{ fontSize: 12, color: '#666' }}>Aktif</span>
                  </label>
                </div>
                <input value={form.music_url} onChange={e => update('music_url', e.target.value)} disabled={!form.music_enabled} placeholder="https://youtube.com/watch?v=..." className="input-elegant" style={{ opacity: form.music_enabled ? 1 : 0.5 }} />
                <p style={{ fontSize: 11, color: '#aaa', marginTop: 6 }}>Masukkan link YouTube atau YouTube Music untuk lagu pilihan Anda.</p>
              </div>
            </div>
          )}

          {/* Step 6: Selesai */}
          {step === 6 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>🎊</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', marginBottom: 8 }}>Undangan Siap Beraksi!</h2>
              <p style={{ fontSize: 14, color: '#888', marginBottom: 32, maxWidth: 460, margin: '0 auto 32px' }}>Semua data telah tersimpan sebagai draft. Anda dapat mempublikasikannya setelah ini.</p>

              <div style={{ background: '#FAFAFA', borderRadius: 20, padding: 24, textAlign: 'left', marginBottom: 32 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#E8627A', marginBottom: 16 }}>Ringkasan Akhir</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div><div style={{ fontSize: 11, color: '#aaa' }}>Judul Acara</div><div style={{ fontSize: 13, fontWeight: 600 }}>{form.event_name}</div></div>
                  <div><div style={{ fontSize: 11, color: '#aaa' }}>Tema Dipilih</div><div style={{ fontSize: 13, fontWeight: 600 }}>{THEMES.find(t => t.id === form.theme)?.label}</div></div>
                  <div><div style={{ fontSize: 11, color: '#aaa' }}>Total Foto</div><div style={{ fontSize: 13, fontWeight: 600 }}>{form.gallery.length} Lembar</div></div>
                  <div><div style={{ fontSize: 11, color: '#aaa' }}>Rekening</div><div style={{ fontSize: 13, fontWeight: 600 }}>{form.gifts.length} Terdaftar</div></div>
                </div>
              </div>

              <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ padding: '16px 40px', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                {loading ? <><Loader size={18} className="animate-spin" /> Sedang Menyiapkan...</> : <>🚀 Terbitkan Undangan</>}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          style={{
            padding: '12px 28px', borderRadius: 100, border: '1.5px solid #eee', background: 'white',
            display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600, color: '#666',
            cursor: step === 0 ? 'not-allowed' : 'pointer', opacity: step === 0 ? 0.3 : 1
          }}
          disabled={step === 0}
        >
          <ArrowLeft size={18} /> Kembali
        </button>

        {step < 6 && (
          <button
            onClick={() => {
              if (step === 0 && !form.event_name) return toast.error('Nama acara harus diisi')
              setStep(step + 1)
            }}
            className="btn-primary"
            style={{ padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            Lanjut Langkah Berikutnya <ArrowRight size={18} />
          </button>
        )}
      </div>

      <style jsx>{`
        .label-elegant { font-size: 13px; font-weight: 600; color: #444; display: block; margin-bottom: 10px; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}

