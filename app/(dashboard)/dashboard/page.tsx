'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Users, CheckCircle, Clock, Heart, Eye, Share2, Calendar, MessageCircle, Hourglass } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const [invitations, setInvitations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUndangan: 0,
    totalTamu: 0,
    tamuHadir: 0,
    tamuBerhalangan: 0,
    tamuPending: 0,
    totalUcapan: 0
  })
  const [recentRSVP, setRecentRSVP] = useState<any[]>([])
  const [recentWishes, setRecentWishes] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: invs } = await supabase.from('invitations').select('id, event_name, slug, event_date').eq('user_id', user.id).order('created_at', { ascending: false })
        
        if (!invs || invs.length === 0) {
          setLoading(false)
          return
        }

        setInvitations(invs)
        const invIds = invs.map(i => i.id)

        // Get Guests/RSVP stats
        const { data: guests } = await supabase.from('guests').select('id, guest_name, email, status, created_at').in('invitation_id', invIds).order('created_at', { ascending: false })
        
        // Get Wishes stats
        const { data: wishes } = await supabase.from('wishes').select('id, guest_name, message, created_at').in('invitation_id', invIds).eq('status', 'visible').order('created_at', { ascending: false })

        setStats({
          totalUndangan: invs.length,
          totalTamu: guests?.length || 0,
          tamuHadir: guests?.filter(g => g.status === 'attending').length || 0,
          tamuBerhalangan: guests?.filter(g => g.status === 'declined').length || 0,
          tamuPending: guests?.filter(g => g.status === 'pending').length || 0,
          totalUcapan: wishes?.length || 0
        })

        setRecentRSVP((guests || []).filter(g => g.status !== 'pending').slice(0, 5))
        setRecentWishes((wishes || []).slice(0, 3))

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleShare = () => {
    if (invitations.length === 0) {
      toast.error('Anda belum memiliki undangan untuk dibagikan')
      return
    }
    const firstInv = invitations[0]
    const url = `${window.location.origin}/undangan/${firstInv.slug}`
    navigator.clipboard.writeText(url)
    toast.success('Link undangan berhasil disalin! 📋')
  }

  const firstInv = invitations[0] || null
  const hasGuests = stats.totalTamu > 0

  const presentPercent = stats.totalTamu ? Math.round((stats.tamuHadir / stats.totalTamu) * 100) : 0;
  const absentPercent = stats.totalTamu ? Math.round((stats.tamuBerhalangan / stats.totalTamu) * 100) : 0;
  const pendingPercent = stats.totalTamu ? Math.round((stats.tamuPending / stats.totalTamu) * 100) : 0;

  const STATS_CARDS = [
    { label: 'Total Tamu', value: String(stats.totalTamu), icon: Users, color: '#3B82F6', bg: '#EFF6FF', tag: stats.totalTamu > 0 ? `${stats.totalTamu} orang` : 'Belum ada', tagColor: '#10B981', tagBg: '#D1FAE5', tagType: stats.totalTamu > 0 ? 'badge' : 'text' },
    { label: 'RSVP Diterima', value: String(stats.tamuHadir), icon: CheckCircle, color: '#10B981', bg: '#ECFDF5', tag: stats.totalTamu > 0 ? `${presentPercent}%` : '0%', tagColor: '#10B981', tagBg: '#D1FAE5', tagType: 'badge' },
    { label: 'Menunggu Respon', value: String(stats.tamuPending), icon: Hourglass, color: '#F59E0B', bg: '#FFFBEB', tag: `${stats.tamuPending} Menunggu`, tagColor: '#64748b', tagType: 'text' },
    { label: 'Total Ucapan', value: String(stats.totalUcapan), icon: MessageCircle, color: '#db2777', bg: '#fdf2f8', tag: stats.totalUcapan > 0 ? `${stats.totalUcapan} ucapan` : 'Belum ada', tagColor: '#64748b', tagType: 'text' },
  ]

  if (loading) return (
    <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ fontSize: 40 }}>🌸</motion.div>
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Page Header */}
      <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              background: '#FDE8ED', borderRadius: 4, padding: '4px 8px',
              fontSize: 10, color: '#E8627A', fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: 1
            }}>
              SEDANG MENGELOLA
            </div>
            <span style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>
              Undangan: Andi & Sarah
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 24px)', fontWeight: 800, color: '#1e293b', letterSpacing: -0.5, marginBottom: 8 }}>
            Ikhtisar Pernikahan
          </h1>
          <p style={{ fontSize: 13, color: '#64748b', maxWidth: 600 }}>
            Selamat datang kembali! Hari bahagia Anda tinggal 42 hari lagi.
          </p>
        </div>
        
        <button 
          onClick={handleShare}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#E8627A', border: 'none',
            borderRadius: 8, padding: '10px 16px',
            fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(232, 98, 122, 0.2)',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
        >
          <Share2 size={16} color="white" /> Bagikan Tautan
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 40 }}>
        {STATS_CARDS.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              style={{
                background: 'white', borderRadius: 24, padding: '28px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02), 0 8px 10px -6px rgba(0,0,0,0.02)',
                border: '1px solid rgba(0,0,0,0.04)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={stat.color} />
                </div>
                {stat.tagType === 'badge' ? (
                  <span style={{ fontSize: 11, color: stat.tagColor, fontWeight: 700, background: stat.tagBg, padding: '4px 10px', borderRadius: 100 }}>
                    {stat.tag}
                  </span>
                ) : (
                  <span style={{ fontSize: 13, color: stat.tagColor, fontWeight: 500 }}>
                    {stat.tag}
                  </span>
                )}
              </div>
              <div>
                <p style={{ fontSize: 13, color: '#64748b', fontWeight: 500, marginBottom: 8 }}>{stat.label}</p>
                <h3 style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', margin: 0 }}>{stat.value}</h3>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Main Grid: RSVP Progress & Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 24 }}>
        
        {/* RSVP Progress */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          style={{ 
            background: 'white', borderRadius: 16, padding: '24px', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
            border: '1px solid #f1f5f9',
            display: 'flex', flexDirection: 'column'
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 24 }}>
            Progres RSVP
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
            {/* Hadir */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>
                <span style={{ color: '#475569' }}>Hadir</span>
                <span style={{ color: '#1e293b' }}>{presentPercent}% ({stats.tamuHadir})</span>
              </div>
              <div style={{ width: '100%', height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${presentPercent}%`, height: '100%', background: '#10B981', borderRadius: 4 }} />
              </div>
            </div>

            {/* Berhalangan */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>
                <span style={{ color: '#475569' }}>Berhalangan</span>
                <span style={{ color: '#1e293b' }}>{absentPercent}% ({stats.tamuBerhalangan})</span>
              </div>
              <div style={{ width: '100%', height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${absentPercent}%`, height: '100%', background: '#EF4444', borderRadius: 4 }} />
              </div>
            </div>

            {/* Belum Merespon */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>
                <span style={{ color: '#475569' }}>Belum Merespon</span>
                <span style={{ color: '#1e293b' }}>{pendingPercent}% ({stats.tamuPending})</span>
              </div>
              <div style={{ width: '100%', height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${pendingPercent}%`, height: '100%', background: '#cbd5e1', borderRadius: 4 }} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #f1f5f9' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>Tenggat Waktu Terdekat</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
              <div style={{ width: 6, height: 6, background: '#E8627A', borderRadius: '50%' }} />
              <span style={{ fontWeight: 600, color: '#475569' }}>Batas RSVP: <span style={{ color: '#64748b', fontWeight: 500 }}>Dalam 5 hari</span></span>
            </div>
          </div>
        </motion.div>

        {/* Invitation Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45 }}
          style={{ 
            background: 'white', borderRadius: 16, padding: '24px', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
            border: '1px solid #f1f5f9',
            display: 'flex', flexDirection: 'column', gridColumn: 'span 2'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
              Pratinjau Undangan
            </h3>
            <Link href="/dashboard/kustomisasi" style={{ fontSize: 13, color: '#E8627A', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>Ubah Desain</span> <span style={{ fontSize: 14 }}>✏️</span>
            </Link>
          </div>

          <div style={{
            borderRadius: 12, overflow: 'hidden',
            background: '#f8fafc',
            border: 'none', minHeight: 320,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', position: 'relative',
            flex: 1
          }}>
            {firstInv ? (
              <div style={{ 
                width: '100%', height: '100%', position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundImage: 'url("https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
                backgroundSize: 'cover', backgroundPosition: 'center'
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(2px)' }} />
                
                <div style={{ 
                  background: 'white', padding: '32px', borderRadius: 8, 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 10,
                  textAlign: 'center', width: '80%', maxWidth: 360,
                  border: '1px solid #f1f5f9'
                }}>
                  <p style={{ fontSize: 10, letterSpacing: 4, color: '#E8627A', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>SIMPAN TANGGALNYA</p>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>
                    {firstInv.event_name}
                  </h2>
                  <p style={{ fontSize: 12, color: '#64748b', marginBottom: 20, fontStyle: 'italic' }}>Akan melangsungkan pernikahan</p>
                  
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: 8, marginBottom: 24 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
                      {firstInv.event_date ? new Date(firstInv.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tanggal Belum Ditentukan'}
                    </p>
                    <p style={{ fontSize: 12, color: '#64748b' }}>Jakarta, Indonesia</p>
                  </div>

                  <Link 
                    href={`/undangan/${firstInv.slug}`}
                    target="_blank"
                    style={{
                      display: 'inline-block',
                      background: '#E8627A',
                      color: 'white', borderRadius: 8,
                      padding: '10px 24px', fontSize: 12, fontWeight: 700,
                      textDecoration: 'none', transition: 'all 0.2s', width: '100%'
                    }}
                  >
                    RSVP SEKARANG
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ padding: 20, textAlign: 'center' }}>
                <Clock size={48} color="#cbd5e1" style={{ marginBottom: 16, margin: '0 auto' }} />
                <p style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>Belum ada undangan aktif</p>
                <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 8 }}>Buat undangan untuk melihat pratinjau</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginBottom: 24 }}>
        
        {/* RSVP Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ background: 'white', borderRadius: 16, padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
              Respon Tamu Terbaru
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0', color: '#94a3b8' }}>
              <span style={{ fontSize: 13, marginRight: 8 }}>🔍</span>
              <input type="text" placeholder="Cari tamu..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: '#475569', width: 120 }} />
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#64748b', textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                <th style={{ paddingBottom: 16, fontWeight: 700 }}>NAMA TAMU</th>
                <th style={{ paddingBottom: 16, fontWeight: 700 }}>STATUS</th>
                <th style={{ paddingBottom: 16, fontWeight: 700 }}>PASANGAN</th>
                <th style={{ paddingBottom: 16, fontWeight: 700, textAlign: 'right' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {recentRSVP.length > 0 ? recentRSVP.map((row, idx) => (
                <tr key={row.id} style={{ borderBottom: idx === recentRSVP.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: '#FDE8ED',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#E8627A', fontSize: 13, fontWeight: 700,
                      }}>
                        {row.guest_name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{row.guest_name}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{row.email || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 0' }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 100,
                      background: row.status === 'attending' ? '#D1FAE5' : '#FEE2E2',
                      color: row.status === 'attending' ? '#059669' : '#DC2626',
                    }}>
                      {row.status === 'attending' ? 'Hadir' : 'Tidak'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 0', color: '#64748b' }}>-</td>
                  <td style={{ padding: '16px 0', textAlign: 'right', color: '#cbd5e1' }}>
                    <span style={{ cursor: 'pointer', fontWeight: 800 }}>•••</span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8' }}>Belum ada tamu</td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>

        {/* Wishes Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          style={{ background: 'white', borderRadius: 16, padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
              Buku Tamu
            </h3>
            <Link href="/dashboard/pesan" style={{ fontSize: 12, color: '#E8627A', textDecoration: 'none', fontWeight: 600 }}>Lihat Semua</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {recentWishes.length > 0 ? recentWishes.map((wish, idx) => (
              <div key={wish.id} style={{ display: 'flex', gap: 16 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: '#FDE8ED', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#E8627A', fontSize: 13, fontWeight: 700
                }}>
                  {wish.guest_name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, width: '100%', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{wish.guest_name}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(wish.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
                    "{wish.message}"
                  </p>
                </div>
              </div>
            )) : (
              <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                Belum ada ucapan yang masuk.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
