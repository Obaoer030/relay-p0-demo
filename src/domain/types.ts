export type ActorId = 'linran' | 'xiaoyu' | 'landlord' | 'sister'

export type MatterStatus = 'mine' | 'waiting' | 'relayed' | 'completed'

export type HandoffStatus =
  | 'draft'
  | 'shared'
  | 'accepted'
  | 'declined'
  | 'completed'

export type DemoStage =
  | 'initial'
  | 'shared'
  | 'accepted'
  | 'declined'
  | 'completed'

export type Matter = {
  id: string
  title: string
  context: string
  nextAction: string
  requiredMaterial?: string
  doneDefinition: string
  boundary?: string
  dueAt?: string
  status: MatterStatus
  currentActor: ActorId
  loadLevel?: 'normal' | 'heavy'
  relationship?: string
  completedAt?: string
  completedBy?: ActorId
}

export type Handoff = {
  id: string
  matterId: string
  requester: 'linran'
  target: 'xiaoyu'
  token: 'demo-cat-checkup'
  status: HandoffStatus
  sharedAt?: string
  respondedAt?: string
  completedAt?: string
}

export type RelayState = {
  seedVersion: number
  activeActor: 'linran' | 'xiaoyu'
  demoStage: DemoStage
  reduceMotion: boolean
  matters: Matter[]
  handoffs: Handoff[]
  lastEventAt: string
}

export type RelayAction =
  | { type: 'share'; at?: string }
  | { type: 'accept'; at?: string }
  | { type: 'decline'; at?: string }
  | { type: 'complete'; at?: string }
  | { type: 'reset'; now?: Date }
  | { type: 'jump'; stage: Exclude<DemoStage, 'declined'>; now?: Date }
  | { type: 'set-active-actor'; actor: 'linran' | 'xiaoyu'; at?: string }
  | { type: 'set-reduce-motion'; value: boolean; at?: string }
  | { type: 'hydrate'; state: RelayState }
