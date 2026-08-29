import type {
  WorkspaceDisplayStatus,
  WorkspaceMatter,
  WorkspaceUser,
  WorkspaceUserId,
} from './types'

export const getActiveUser = (users: WorkspaceUser[], activeUserId: WorkspaceUserId) =>
  users.find((user) => user.id === activeUserId) ?? users[0]

export const isMatterVisibleTo = (matter: WorkspaceMatter, userId: WorkspaceUserId) =>
  matter.creatorId === userId ||
  matter.ownerId === userId ||
  matter.participantIds.includes(userId) ||
  matter.handoffTargetId === userId

export const getPerspectiveStatus = (
  matter: WorkspaceMatter,
  userId: WorkspaceUserId,
): WorkspaceDisplayStatus => {
  if (matter.status === 'completed') return 'completed'
  if (matter.status === 'waiting') {
    return matter.handoffTargetId === userId ? 'incoming' : 'waiting'
  }
  if (matter.ownerId === userId) return 'mine'
  return matter.status === 'mine' ? 'relayed' : matter.status
}

export const visibleMattersFor = (matters: WorkspaceMatter[], userId: WorkspaceUserId) =>
  matters.filter((matter) => isMatterVisibleTo(matter, userId))

export const canRespondToMatter = (matter: WorkspaceMatter, userId: WorkspaceUserId) =>
  matter.status === 'waiting' && matter.handoffTargetId === userId

export const canCompleteMatter = (matter: WorkspaceMatter, userId: WorkspaceUserId) =>
  matter.status !== 'completed' && matter.ownerId === userId
