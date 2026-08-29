import { ArrowUpRight, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDueAt } from '../lib/format'
import { useWorkspace } from '../workspace/WorkspaceContext'
import { getPerspectiveStatus } from '../workspace/perspective'
import type { WorkspaceMatter } from '../workspace/types'
import { workspaceStatus } from './workspaceStatus'

export function WorkspaceMatterCard({ matter, compact = false, order }: { matter: WorkspaceMatter; compact?: boolean; order?: number }) {
  const { state } = useWorkspace()
  const perspectiveStatus = getPerspectiveStatus(matter, state.activeUserId)
  const status = workspaceStatus[perspectiveStatus]
  return (
    <Link to={`/matters/${matter.id}`} className={`workspace-matter-card ${compact ? 'is-compact' : ''}`} data-status={perspectiveStatus}>
      {!compact && <span className="workspace-matter-card__signal" aria-hidden="true" />}
      <div className="workspace-matter-card__meta">
        <div>
          {order && <span className="workspace-matter-card__sequence">{String(order).padStart(2, '0')}</span>}
          <span className="workspace-matter-card__category">{matter.agentGenerated && matter.planStepIndex ? `Agent 计划 · ${matter.planStepIndex}/${matter.planStepTotal}` : matter.category}</span>
        </div>
        {matter.dueAt && <time><Clock3 size={14} /> <span>截止</span> {formatDueAt(matter.dueAt)}</time>}
      </div>
      <div className="workspace-matter-card__title">
        <h3>{matter.title}</h3>
        <span className="workspace-matter-card__open"><ArrowUpRight size={17} aria-hidden="true" /></span>
      </div>
      {!compact && <p><span>下一步</span>{matter.nextAction}</p>}
      <div className="workspace-owner-row">
        <span className="workspace-status-dot" />
        <strong>{status.label}</strong>
        <span>{compact ? matter.ownerName : `当前推进 · ${matter.ownerName}`}</span>
      </div>
    </Link>
  )
}
