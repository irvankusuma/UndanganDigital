'use client'

import { ChevronDown } from 'lucide-react'
import type { UserInvitation } from './useSelectedInvitation'

interface InvitationSwitcherProps {
  invitations: UserInvitation[]
  selectedInvId: string | null
  onChange: (id: string) => void
}

export function InvitationSwitcher({ invitations, selectedInvId, onChange }: InvitationSwitcherProps) {
  if (invitations.length <= 1) return null

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <select
        value={selectedInvId || ''}
        onChange={(e) => onChange(e.target.value)}
        className="input-elegant"
        style={{
          appearance: 'none',
          paddingRight: 34,
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          minWidth: 200,
          background: 'white',
        }}
      >
        {invitations.map(inv => (
          <option key={inv.id} value={inv.id}>{inv.event_name}</option>
        ))}
      </select>
      <ChevronDown size={15} color="#888" style={{ position: 'absolute', right: 12, pointerEvents: 'none' }} />
    </div>
  )
}
