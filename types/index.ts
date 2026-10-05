export type EventType = 'wedding' | 'birthday' | 'family' | 'seminar' | 'other'
export type ThemeType = 'elegant' | 'minimalist' | 'romantic' | 'modern' | 'garden'
export type RSVPStatus = 'attending' | 'not_attending' | 'pending'
export type WishStatus = 'visible' | 'hidden' | 'pending'
export type GuestCategory = 'family' | 'friend' | 'coworker' | 'vip' | 'other'
export type InvitationStatus = 'active' | 'draft' | 'completed' | 'archived'

export interface Profile {
  id: string
  name: string
  email: string
  avatar_url?: string
  plan: 'free' | 'premium' | 'business'
  plan_expires_at?: string
  created_at: string
}

export interface Invitation {
  id: string
  user_id: string
  event_name: string
  slug: string
  event_type: EventType
  status: InvitationStatus
  event_date?: string
  event_time?: string
  akad_date?: string
  akad_location?: string
  akad_time?: string
  akad_location_url?: string
  reception_date?: string
  reception_location?: string
  reception_time?: string
  bride_name?: string
  bride_father_name?: string
  bride_mother_name?: string
  bride_child_order?: string
  bride_father_is_deceased?: boolean
  bride_mother_is_deceased?: boolean
  bride_photo?: string
  groom_name?: string
  groom_father_name?: string
  groom_mother_name?: string
  groom_child_order?: string
  groom_father_is_deceased?: boolean
  groom_mother_is_deceased?: boolean
  groom_photo?: string
  description?: string
  greeting_text?: string
  story?: string
  cover_image?: string
  theme: ThemeType
  color_hex?: string
  font_title?: string
  font_body?: string
  music_url?: string
  gallery_images?: string[]
  rsvp_deadline?: string
  max_guests?: number
  location_name?: string
  location_address?: string
  location_url?: string
  location_map_url?: string
  location_embed?: string

  // Feature toggles (DB column names)
  enable_rsvp?: boolean
  enable_wishes?: boolean
  enable_gallery?: boolean
  enable_gifts?: boolean
  enable_music?: boolean
  enable_countdown?: boolean

  // Alias names used in some components
  music_enabled?: boolean
  gift_enabled?: boolean
  countdown_enabled?: boolean
  wishes_enabled?: boolean
  rsvp_enabled?: boolean
  gallery_enabled?: boolean

  created_at: string
  updated_at: string
}

export interface Guest {
  id: string
  invitation_id: string
  guest_name: string
  email?: string
  phone?: string
  category?: GuestCategory
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

// Helper to resolve feature toggle from either naming convention
export function isFeatureEnabled(inv: Invitation, feature: 'rsvp' | 'wishes' | 'gallery' | 'gifts' | 'music' | 'countdown'): boolean {
  switch (feature) {
    case 'rsvp':
      return inv.enable_rsvp ?? inv.rsvp_enabled ?? true
    case 'wishes':
      return inv.enable_wishes ?? inv.wishes_enabled ?? true
    case 'gallery':
      return inv.enable_gallery ?? inv.gallery_enabled ?? true
    case 'gifts':
      return inv.enable_gifts ?? inv.gift_enabled ?? false
    case 'music':
      return inv.enable_music ?? inv.music_enabled ?? false
    case 'countdown':
      return inv.enable_countdown ?? inv.countdown_enabled ?? true
    default:
      return true
  }
}
