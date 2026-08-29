import { createSeedState, HERO_MATTER_ID, SEED_VERSION } from './seed'
import type { DemoStage, RelayAction, RelayState } from './types'

const actionTime = (at?: string) => at ?? new Date().toISOString()

function updateHero(
  state: RelayState,
  update: (matter: RelayState['matters'][number]) => RelayState['matters'][number],
) {
  return state.matters.map((matter) =>
    matter.id === HERO_MATTER_ID ? update(matter) : matter,
  )
}

function updateHandoff(
  state: RelayState,
  update: (handoff: RelayState['handoffs'][number]) => RelayState['handoffs'][number],
) {
  return state.handoffs.map((handoff) =>
    handoff.matterId === HERO_MATTER_ID ? update(handoff) : handoff,
  )
}

function transition(state: RelayState, action: RelayAction): RelayState {
  switch (action.type) {
    case 'share': {
      if (state.demoStage !== 'initial') return state
      const at = actionTime(action.at)
      return {
        ...state,
        activeActor: 'xiaoyu',
        demoStage: 'shared',
        matters: updateHero(state, (matter) => ({
          ...matter,
          status: 'waiting',
          currentActor: 'linran',
        })),
        handoffs: updateHandoff(state, (handoff) => ({
          ...handoff,
          status: 'shared',
          sharedAt: at,
        })),
        lastEventAt: at,
      }
    }

    case 'accept': {
      if (state.demoStage !== 'shared') return state
      const at = actionTime(action.at)
      return {
        ...state,
        demoStage: 'accepted',
        matters: updateHero(state, (matter) => ({
          ...matter,
          status: 'relayed',
          currentActor: 'xiaoyu',
        })),
        handoffs: updateHandoff(state, (handoff) => ({
          ...handoff,
          status: 'accepted',
          respondedAt: at,
        })),
        lastEventAt: at,
      }
    }

    case 'decline': {
      if (state.demoStage !== 'shared') return state
      const at = actionTime(action.at)
      return {
        ...state,
        activeActor: 'linran',
        demoStage: 'declined',
        matters: updateHero(state, (matter) => ({
          ...matter,
          status: 'mine',
          currentActor: 'linran',
        })),
        handoffs: updateHandoff(state, (handoff) => ({
          ...handoff,
          status: 'declined',
          respondedAt: at,
        })),
        lastEventAt: at,
      }
    }

    case 'complete': {
      if (state.demoStage !== 'accepted') return state
      const at = actionTime(action.at)
      return {
        ...state,
        demoStage: 'completed',
        matters: updateHero(state, (matter) => ({
          ...matter,
          status: 'completed',
          currentActor: 'xiaoyu',
          completedAt: at,
          completedBy: 'xiaoyu',
        })),
        handoffs: updateHandoff(state, (handoff) => ({
          ...handoff,
          status: 'completed',
          completedAt: at,
        })),
        lastEventAt: at,
      }
    }

    case 'reset':
      return createSeedState(action.now)

    case 'jump':
      return jumpToStage(action.stage, action.now)

    case 'set-active-actor': {
      if (state.activeActor === action.actor) return state
      return {
        ...state,
        activeActor: action.actor,
        lastEventAt: actionTime(action.at),
      }
    }

    case 'set-reduce-motion': {
      if (state.reduceMotion === action.value) return state
      return {
        ...state,
        reduceMotion: action.value,
        lastEventAt: actionTime(action.at),
      }
    }

    case 'hydrate':
      return action.state.seedVersion === SEED_VERSION ? action.state : state
  }
}

export function jumpToStage(
  stage: Exclude<DemoStage, 'declined'>,
  now = new Date(),
) {
  let state = createSeedState(now)
  if (stage === 'initial') return state

  const at = now.toISOString()
  state = transition(state, { type: 'share', at })
  if (stage === 'shared') return state

  state = transition(state, { type: 'accept', at })
  if (stage === 'accepted') return state

  return transition(state, { type: 'complete', at })
}

export function relayReducer(state: RelayState, action: RelayAction) {
  return transition(state, action)
}
