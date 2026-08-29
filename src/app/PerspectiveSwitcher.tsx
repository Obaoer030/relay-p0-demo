import { ChevronDown, UsersRound } from 'lucide-react'
import { useWorkspace } from '../workspace/WorkspaceContext'
import { getActiveUser } from '../workspace/perspective'
import type { WorkspaceUserId } from '../workspace/types'

export function PerspectiveSwitcher({ compact = false }: { compact?: boolean }) {
  const { state, dispatch } = useWorkspace()
  const activeUser = getActiveUser(state.users, state.activeUserId)

  return (
    <label className={`perspective-switcher ${compact ? 'is-compact' : ''}`}>
      <span className={`perspective-switcher__avatar tone-${activeUser.tone}`} aria-hidden="true">
        {activeUser.initial}
      </span>
      <span className="perspective-switcher__copy">
        <small><UsersRound size={12} /> 演示视角</small>
        <strong>{activeUser.name}</strong>
      </span>
      <ChevronDown className="perspective-switcher__chevron" size={16} aria-hidden="true" />
      <select
        aria-label="切换用户视角"
        value={state.activeUserId}
        onChange={(event) => dispatch({ type: 'set-active-user', userId: event.target.value as WorkspaceUserId })}
      >
        {state.users.map((user) => (
          <option key={user.id} value={user.id}>{user.name} · {user.role}</option>
        ))}
      </select>
    </label>
  )
}
