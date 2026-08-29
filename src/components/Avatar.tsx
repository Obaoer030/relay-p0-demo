import type { ActorId } from '../domain/types'
import { actorName } from '../lib/actors'

export function Avatar({ actor, size = 'md' }: { actor: ActorId; size?: 'sm' | 'md' }) {
  return (
    <span className={`avatar avatar--${actor} avatar--${size}`} aria-hidden="true">
      {actorName(actor).slice(-1)}
    </span>
  )
}
