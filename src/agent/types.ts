import type { WorkspacePriority, WorkspaceUserId } from '../workspace/types.ts'

export type AgentTranscriptMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type AgentPlanStep = {
  id: string
  title: string
  nextAction: string
  ownerId: WorkspaceUserId
  ownerName: string
  doneDefinition: string
  dueDate?: string
}

export type AgentPlanDraft = {
  title: string
  context: string
  category: string
  priority: WorkspacePriority
  boundary: string
  steps: AgentPlanStep[]
  missingFields: string[]
  assumptions: string[]
}

export type AgentTurnRequest = {
  input: string
  transcript: AgentTranscriptMessage[]
  currentUserId: WorkspaceUserId
  users: Array<{ id: WorkspaceUserId; name: string; role: string }>
}

export type AgentTurnResponse = {
  status: 'needs_input' | 'ready'
  message: string
  question?: string
  draft: AgentPlanDraft
  engine: 'minimax' | 'local-demo'
  notice?: string
}

const userIds = new Set<WorkspaceUserId>(['linran', 'xiaoyu', 'sister', 'chenyu'])
const priorities = new Set<WorkspacePriority>(['low', 'normal', 'high'])
const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === 'object'

export function isAgentTurnResponse(value: unknown): value is AgentTurnResponse {
  if (!isRecord(value) || !['needs_input', 'ready'].includes(String(value.status)) || typeof value.message !== 'string' || !isRecord(value.draft)) return false
  const draft = value.draft
  if (!['title', 'context', 'category', 'boundary'].every((key) => typeof draft[key] === 'string') || !priorities.has(draft.priority as WorkspacePriority)) return false
  if (!Array.isArray(draft.missingFields) || !draft.missingFields.every((item) => typeof item === 'string') || !Array.isArray(draft.assumptions) || !draft.assumptions.every((item) => typeof item === 'string')) return false
  if (!Array.isArray(draft.steps) || draft.steps.length === 0 || draft.steps.length > 6) return false
  return draft.steps.every((step) => isRecord(step) && ['id', 'title', 'nextAction', 'ownerName', 'doneDefinition'].every((key) => typeof step[key] === 'string') && userIds.has(step.ownerId as WorkspaceUserId) && (step.dueDate === undefined || typeof step.dueDate === 'string'))
}
