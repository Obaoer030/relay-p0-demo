export type WorkspaceMatterStatus = 'mine' | 'waiting' | 'relayed' | 'completed'
export type WorkspacePriority = 'low' | 'normal' | 'high'

export type WorkspaceMatter = {
  id: string
  title: string
  context: string
  nextAction: string
  doneDefinition: string
  boundary: string
  dueAt?: string
  status: WorkspaceMatterStatus
  ownerName: string
  handoffTargetId?: string
  category: string
  priority: WorkspacePriority
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export type TrustedPerson = {
  id: string
  name: string
  initial: string
  relationship: string
  note: string
  completedCount: number
  tone: 'coral' | 'sand' | 'sage' | 'plum'
}

export type ActivityEntry = {
  id: string
  matterId?: string
  kind: 'created' | 'updated' | 'status' | 'deleted' | 'system'
  title: string
  detail: string
  actor: string
  at: string
}

export type WorkspaceState = {
  version: number
  matters: WorkspaceMatter[]
  people: TrustedPerson[]
  activity: ActivityEntry[]
  reduceMotion: boolean
}

export type WorkspaceAction =
  | { type: 'add-matter'; matter: WorkspaceMatter }
  | { type: 'update-matter'; matter: WorkspaceMatter }
  | { type: 'delete-matter'; id: string; at?: string }
  | { type: 'set-status'; id: string; status: WorkspaceMatterStatus; ownerName?: string; targetId?: string; at?: string }
  | { type: 'set-reduce-motion'; value: boolean }
  | { type: 'reset'; now?: Date }
  | { type: 'hydrate'; state: WorkspaceState }
