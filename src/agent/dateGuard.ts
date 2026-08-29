import type { AgentTurnRequest, AgentTurnResponse } from './types.ts'

const explicitIsoDate = /\b\d{4}-\d{2}-\d{2}\b/

export function guardAgentDueDates(response: AgentTurnResponse, request: AgentTurnRequest): AgentTurnResponse {
  const combined = [...request.transcript.filter((item) => item.role === 'user').map((item) => item.content), request.input].join('；')
  const userDates = new Set(combined.match(new RegExp(explicitIsoDate.source, 'g')) ?? [])
  return {
    ...response,
    draft: {
      ...response.draft,
      steps: response.draft.steps.map((step) => {
        if (step.dueDate && userDates.has(step.dueDate)) return step
        const { dueDate: _unverifiedModelDate, ...withoutDueDate } = step
        void _unverifiedModelDate
        return withoutDueDate
      }),
    },
  }
}
