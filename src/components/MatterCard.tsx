import { Clock3 } from 'lucide-react'
import type { DemoStage, Matter } from '../domain/types'
import { actorName } from '../lib/actors'
import { formatDueAt } from '../lib/format'
import { Avatar } from './Avatar'
import { ResponsibilityRail } from './ResponsibilityRail'

export function MatterCard({
  matter,
  stage,
  reduceMotion,
  hero = false,
}: {
  matter: Matter
  stage?: DemoStage
  reduceMotion?: boolean
  hero?: boolean
}) {
  if (!hero) {
    return (
      <article className="matter-card matter-card--compact" data-matter-id={matter.id}>
        <div>
          <h3>{matter.title}</h3>
          <p>{matter.nextAction}</p>
        </div>
        <span className="owner-chip">
          <Avatar actor={matter.currentActor} size="sm" />
          {actorName(matter.currentActor)}
        </span>
      </article>
    )
  }

  return (
    <article className="matter-card matter-card--hero" data-matter-id={matter.id}>
      <div className="matter-card__topline">
        <span className="matter-card__load">比较挂心</span>
        {matter.dueAt && (
          <span className="matter-card__time">
            <Clock3 size={14} aria-hidden="true" />
            {formatDueAt(matter.dueAt)}
          </span>
        )}
      </div>
      <h3>{matter.title}</h3>
      <ResponsibilityRail
        status={matter.status}
        stage={stage}
        reduceMotion={reduceMotion}
        compact
      />
    </article>
  )
}
