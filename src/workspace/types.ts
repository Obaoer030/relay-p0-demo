export type WorkspaceMatterStatus = 'mine' | 'waiting' | 'relayed' | 'completed'
export type WorkspaceDisplayStatus = WorkspaceMatterStatus | 'incoming'
export type WorkspacePriority = 'low' | 'normal' | 'high'
export type WorkspaceUserId = 'linran' | 'xiaoyu' | 'sister' | 'chenyu'

export type WorkspaceUser = {
  id: WorkspaceUserId
  name: string
  initial: string
  role: string
  note: string
  tone: 'coral' | 'sand' | 'sage' | 'blue'
}

export type WorkspaceMatter = {
  id: string
  title: string
  context: string
  nextAction: string
  doneDefinition: string
  boundary: string
  dueAt?: string
  status: WorkspaceMatterStatus
  creatorId: WorkspaceUserId
  ownerId: WorkspaceUserId | 'landlord' | 'mumu'
  ownerName: string
  participantIds: WorkspaceUserId[]
  handoffTargetId?: WorkspaceUserId | 'mumu'
  category: string
  priority: WorkspacePriority
  createdAt: string
  updatedAt: string
  completedAt?: string
  completionNote?: string
  adjustmentNote?: string
  planId?: string
  planTitle?: string
  planStepIndex?: number
  planStepTotal?: number
  agentGenerated?: boolean
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
  activeUserId: WorkspaceUserId
  users: WorkspaceUser[]
  matters: WorkspaceMatter[]
  people: TrustedPerson[]
  activity: ActivityEntry[]
  reduceMotion: boolean
}

export type WorkspaceAction =
  | { type: 'add-matter'; matter: WorkspaceMatter }
  | { type: 'update-matter'; matter: WorkspaceMatter }
  | { type: 'delete-matter'; id: string; at?: string }
  | { type: 'set-active-user'; userId: WorkspaceUserId }
  | { type: 'accept-handoff'; id: string; actorId?: WorkspaceUserId; at?: string }
  | { type: 'request-adjustment'; id: string; note: string; actorId?: WorkspaceUserId; at?: string }
  | { type: 'decline-handoff'; id: string; actorId?: WorkspaceUserId; at?: string }
  | { type: 'complete-matter'; id: string; note: string; actorId?: WorkspaceUserId; at?: string }
  | { type: 'reopen-matter'; id: string; at?: string }
  | { type: 'set-reduce-motion'; value: boolean }
  | { type: 'reset'; now?: Date }
  | { type: 'hydrate'; state: WorkspaceState }
