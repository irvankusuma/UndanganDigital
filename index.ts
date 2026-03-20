export type EventType = 'wedding' | 'birthday' | 'family' | 'seminar' | 'other'
export type ThemeType = 'elegant' | 'minimalist' | 'romantic' | 'modern' | 'garden'
export type RSVPStatus = 'attending' | 'not_attending' | 'pending'
export type WishStatus = 'visible' | 'hidden' | 'pending'
export type GuestCategory = 'family' | 'friend' | 'coworker' | 'vip' | 'other'
export type InvitationStatus = 'active' | 'draft' | 'completed'

export interface Profile {
  id: string
  name: string
  email: string
  avatar_url?: string
  plan: 'free' | 'premium' | 'business'
  created_at: string
}

export interface Invitation {
  id: string
  user_id: string
  event_name: string
  slug: string
  event_type: EventType
  status: InvitationStatus
  event_date: string

  // Event details
  akad_date?: string
  akad_location?: string
  akad_time?: string
  akad_location_url?: string
  reception_date?: string
  reception_location?: string
  reception_time?: string
  location_url?: string
  location_embed?: string
  location_name?: string
  location_address?: string
  location_map_url?: string

  // People
  bride_name?: string
  bride_father_name?: string
  bride_mother_name?: string
  groom_name?: string
  groom_father_name?: string
  groom_mother_name?: string
  description?: string
  story?: string
  greeting_text?: string

  // Media
  cover_image?: string
  theme: ThemeType
  color_hex?: string
  font_title?: string
  font_body?: string
  music_url?: string
  gallery_images?: string[]

  // Feature toggles — new naming (enable_*)
  enable_rsvp?: boolean
  enable_wishes?: boolean
  enable_gallery?: boolean
  enable_gifts?: boolean
  enable_music?: boolean
  enable_countdown?: boolean

  // Feature toggles — legacy naming (used in undangan page)
  music_enabled?: boolean
  gift_enabled?: boolean
  wishes_enabled?: boolean
  countdown_enabled?: boolean
  gallery_enabled?: boolean
  rsvp_enabled?: boolean

  // Meta
  view_count?: number
  rsvp_deadline?: string
  max_guests?: number
  created_at: string
  updated_at: string
}

export interface Guest {
  id: string
  invitation_id: string
  guest_name: string
  phone?: string
  email?: string
  category: GuestCategory
  status: RSVPStatus
  guest_count: number
  notes?: string
  created_at: string
}

export interface RSVP {
  id: string
  invitation_id: string
  guest_name: string
  email?: string
  attendance_status: RSVPStatus
  guest_count: number
  message?: string
  created_at: string
}

export interface Wish {
  id: string
  invitation_id: string
  guest_name: string
  message: string
  status: WishStatus
  created_at: string
}

export interface GalleryImage {
  id: string
  invitation_id: string
  image_url: string
  caption?: string
  order_index: number
  created_at: string
}

export interface GiftAccount {
  id: string
  invitation_id: string
  bank_name: string
  account_number: string
  account_name: string
  created_at: string
}

export interface DashboardStats {
  total_guests: number
  rsvp_attending: number
  rsvp_not_attending: number
  rsvp_pending: number
  total_wishes: number
  pending_wishes: number
}
