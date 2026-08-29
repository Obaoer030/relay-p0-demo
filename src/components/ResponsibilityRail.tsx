import { motion, useReducedMotion } from 'motion/react'
import type { DemoStage, MatterStatus } from '../domain/types'

type ResponsibilityRailProps = {
  status: MatterStatus
  stage?: DemoStage
  reduceMotion?: boolean
  compact?: boolean
}

const semanticCopy = (status: MatterStatus, stage?: DemoStage) => {
  if (stage === 'declined') return '小雨这次不方便，这一步仍由林然处理'
  if (status === 'waiting') return '等待小雨确认'
  if (status === 'relayed') return '这一步由小雨负责'
  if (status === 'completed') return '小雨已完成这一步'
  return '这一步由林然处理'
}

export function ResponsibilityRail({
  status,
  stage,
  reduceMotion = false,
  compact = false,
}: ResponsibilityRailProps) {
  const prefersReducedMotion = useReducedMotion()
  const heldByXiaoyu = status === 'relayed' || status === 'completed'
  const motionDisabled = reduceMotion || Boolean(prefersReducedMotion)
  const copy = semanticCopy(status, stage)

  return (
    <div
      className={`responsibility-rail ${compact ? 'responsibility-rail--compact' : ''}`}
      data-owner={heldByXiaoyu ? 'xiaoyu' : 'linran'}
      aria-label={`负责人状态：${copy}`}
    >
      <div className="responsibility-rail__names" aria-hidden="true">
        <span className={!heldByXiaoyu ? 'is-current' : ''}>林然</span>
        <span className={heldByXiaoyu ? 'is-current' : ''}>小雨</span>
      </div>
      <div className="responsibility-rail__track" aria-hidden="true">
        <span className="responsibility-rail__endpoint responsibility-rail__endpoint--start" />
        <span className="responsibility-rail__line" />
        <span className="responsibility-rail__endpoint responsibility-rail__endpoint--end" />
        <motion.span
          className="responsibility-rail__active"
          initial={false}
          animate={{ left: heldByXiaoyu ? '100%' : '0%' }}
          transition={motionDisabled ? { duration: 0 } : { duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <p className="responsibility-rail__copy" aria-live="polite">
        {copy}
      </p>
    </div>
  )
}
