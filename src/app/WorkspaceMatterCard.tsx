import { ArrowUpRight, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDueAt } from '../lib/format'
import { useWorkspace } from '../workspace/WorkspaceContext'
import { getPerspectiveStatus } from '../workspace/perspective'
import type { WorkspaceMatter } from '../workspace/types'
import { workspaceStatus } from './workspaceStatus'

export function WorkspaceMatterCard({ matter, compact = false }: { matter: WorkspaceMatter; compact?: boolean }) {
  const { state } = useWorkspace()
  const perspectiveStatus = getPerspectiveStatus(matter, state.activeUserId)
  const status = workspaceStatus[perspectiveStatus]
  return (
    <Link to={`/matters/${matter.id}`} className={`workspace-matter-card ${compact ? 'is-compact' : ''}`} data-status={perspectiveStatus}>
      <div className="workspace-matter-card__meta">
        <span>{matter.agentGenerated && matter.planStepIndex ? `Agent 计划 · ${matter.planStepIndex}/${matter.planStepTotal}` : matter.category}</span>
        {matter.dueAt && <time><Clock3 size={14} /> {formatDueAt(matter.dueAt)}</time>}
      </div>
      <div className="workspace-matter-card__title">
        <h3>{matter.title}</h3>
        <ArrowUpRight size={18} aria-hidden="true" />
      </div>
      {!compact && <p>{matter.nextAction}</p>}
      <div className="workspace-owner-row">
        <span className="workspace-status-dot" />
        <strong>{status.label}</strong>
        <span>{matter.ownerName}</span>
      </div>
    </Link>
  )
}
