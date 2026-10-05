'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface UserInvitation {
  id: string
  event_name: string
  slug: string
}

const STORAGE_KEY = 'eid_selected_invitation'

export function useSelectedInvitation() {
  const [invitations, setInvitations] = useState<UserInvitation[]>([])
  const [selectedInvId, setSelectedInvId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setLoading(false); return }

        const { data } = await supabase
          .from('invitations')
          .select('id, event_name, slug')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        const list = (data || []) as UserInvitation[]
        setInvitations(list)

        if (list.length > 0) {
          let stored: string | null = null
          try { stored = window.localStorage.getItem(STORAGE_KEY) } catch {}
          const valid = stored && list.some(i => i.id === stored) ? stored : list[0].id
          setSelectedInvId(valid)
        }
      } catch (err) {
        console.error('Failed to load invitations:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const selectInvitation = useCallback((id: string) => {
    setSelectedInvId(id)
    try { window.localStorage.setItem(STORAGE_KEY, id) } catch {}
  }, [])

  return { invitations, selectedInvId, selectInvitation, loading }
}
