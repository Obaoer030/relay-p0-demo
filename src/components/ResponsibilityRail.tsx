import { motion, useReducedMotion } from 'motion/react'
import type { DemoStage, MatterStatus } from '../domain/types'

type ResponsibilityRailProps = {
  status: MatterStatus
  stage?: DemoStage
  reduceMotion?: boolean
  compact?: boolean
}

const semanticCopy = (status: MatterStatus, stage?: DemoStage) => {
  if (stage === 'declined') return '小雨这次暂时无法帮忙，下一步回到林然'
  if (status === 'waiting') return '已发给小雨，等待她回应'
  if (status === 'relayed') return '当前由小雨推进'
  if (status === 'completed') return '小雨已完成本次执行'
  return '下一步由林然推进'
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
      aria-label={`责任状态：${copy}`}
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
