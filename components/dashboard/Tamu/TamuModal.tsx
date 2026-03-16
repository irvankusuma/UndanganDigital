'use client'

import { motion } from 'framer-motion'

interface TamuModalProps {
  editGuest: any
  form: any
  setForm: (val: any) => void
  onClose: () => void
  onSave: () => void
}

export function TamuModal({ editGuest, form, setForm, onClose, onSave }: TamuModalProps) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{ background: 'white', borderRadius: 20, padding: 32, width: '100%', maxWidth: 440 }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 24 }}>
          {editGuest ? 'Edit Tamu' : 'Tambah Tamu Baru'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Nama Tamu</label>
            <input value={form.guest_name} onChange={e => setForm({ ...form, guest_name: e.target.value })}
              placeholder="Nama lengkap tamu" className="input-elegant" />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Nomor WA</label>
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="08xxxxxxxxxx" className="input-elegant" />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Kategori</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="input-elegant">
              <option value="family">Keluarga</option>
              <option value="friend">Teman</option>
              <option value="coworker">Teman Kantor</option>
              <option value="vip">VIP</option>
              <option value="other">Lainnya</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Jumlah Tamu</label>
            <input type="number" min={1} max={20} value={form.guest_count}
              onChange={e => setForm({ ...form, guest_count: parseInt(e.target.value) || 1 })}
              className="input-elegant" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #f0f0f0',
            background: 'white', cursor: 'pointer', fontWeight: 600, color: '#666', fontSize: 14,
          }}>Batal</button>
          <button onClick={onSave} className="btn-primary" style={{ flex: 1, fontSize: 14 }}>
            {editGuest ? 'Simpan Perubahan' : 'Tambah Tamu'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
