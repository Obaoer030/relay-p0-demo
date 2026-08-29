import type { ActorId } from '../domain/types'

const names: Record<ActorId, string> = {
  linran: '林然',
  xiaoyu: '小雨',
  landlord: '房东',
  sister: '姐姐',
}

export function actorName(actor: ActorId) {
  return names[actor]
}
