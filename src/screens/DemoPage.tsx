import { Check, Clipboard, Eye, RotateCcw, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { BrandMark } from '../components/BrandMark'
import type { DemoStage } from '../domain/types'
import { useRelay } from '../store/RelayContext'
import { HelperView } from './HelperView'
import { LinRanExperience } from './HandoffFlow'

const stageLabels: Array<{ stage: Exclude<DemoStage, 'declined'>; label: string }> = [
  { stage: 'initial', label: '初始' },
  { stage: 'shared', label: '已分享' },
  { stage: 'accepted', label: '已接住' },
  { stage: 'completed', label: '已完成' },
]

const narration: Record<DemoStage, string> = {
  initial: '最累的不只是做，而是一直记着谁该推进。',
  shared: '请求已经说清楚；决定权和执行责任没有混在一起。',
  accepted: '责任点移动了：现在由小雨推进，林然不需要继续追问。',
  declined: '接棒可以被温和拒绝，责任明确回到林然。',
  completed: '接受不等于完成；现在，这次执行才真正闭环。',
}

function DemoController() {
  const { state, dispatch } = useRelay()
  const [copied, setCopied] = useState(false)

  const copyRoute = async () => {
    const route = `${window.location.origin}/r/demo-cat-checkup`
    await navigator.clipboard.writeText(route)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="demo-controller" aria-label="演示控制器">
      <div className="stage-segments" aria-label="跳转演示阶段">
        {stageLabels.map(({ stage, label }) => (
          <button
            key={stage}
            type="button"
            className={state.demoStage === stage ? 'is-active' : ''}
            onClick={() => dispatch({ type: 'jump', stage })}
          >
            {label}
          </button>
        ))}
      </div>
      <button className="controller-button" type="button" onClick={() => dispatch({ type: 'reset' })}>
        <RotateCcw size={15} /> 重置
      </button>
      <div className="view-switcher" aria-label="移动端视角">
        <Eye size={15} aria-hidden="true" />
        <button
          type="button"
          className={state.activeActor === 'linran' ? 'is-active' : ''}
          onClick={() => dispatch({ type: 'set-active-actor', actor: 'linran' })}
        >林然</button>
        <button
          type="button"
          className={state.activeActor === 'xiaoyu' ? 'is-active' : ''}
          onClick={() => dispatch({ type: 'set-active-actor', actor: 'xiaoyu' })}
        >小雨</button>
      </div>
      <label className="motion-toggle">
        <input
          type="checkbox"
          checked={state.reduceMotion}
          onChange={(event) => dispatch({ type: 'set-reduce-motion', value: event.target.checked })}
        />
        <span aria-hidden="true" />
        减少动态
      </label>
      <button className="controller-button controller-button--icon" type="button" onClick={() => void copyRoute()}>
        {copied ? <Check size={15} /> : <Clipboard size={15} />}
        {copied ? '已复制' : '复制路由'}
      </button>
    </div>
  )
}

function ScenarioClose() {
  return (
    <div className="scenario-close" aria-label="更多接棒场景">
      <p><Sparkles size={15} aria-hidden="true" /> 同一条责任轨道，也能接住——</p>
      <div>
        <span>搬家交接 <small>室友接住验房</small></span>
        <span>父母照护 <small>姐姐接住取报告</small></span>
        <span>伴侣协作 <small>明确下一步由谁推进</small></span>
      </div>
    </div>
  )
}

export function DemoPage() {
  const { state } = useRelay()

  return (
    <main className={`demo-page demo-page--view-${state.activeActor}`} data-stage={state.demoStage}>
      <header className="demo-header">
        <BrandMark />
        <div className="demo-header__context">
          <span>女性黑客松 · 交互原型</span>
          <strong>一次有边界的责任接棒</strong>
        </div>
      </header>
      <DemoController />
      <section className="phone-stage" aria-label="林然与小雨的同步视图">
        <div className="phone-column phone-column--linran">
          <div className="phone-label"><span>01</span> 林然 · 发起者</div>
          <div className="phone-frame">
            <div className="phone-frame__speaker" aria-hidden="true" />
            <LinRanExperience key={`${state.demoStage}-${state.lastEventAt}`} state={state} />
          </div>
        </div>
        <div className="handoff-bridge" aria-hidden="true">
          <span />
          <i>责任</i>
          <span />
        </div>
        <div className="phone-column phone-column--xiaoyu">
          <div className="phone-label"><span>02</span> 小雨 · 接棒者</div>
          <div className={`phone-frame ${state.demoStage === 'initial' ? 'phone-frame--waiting' : ''}`}>
            <div className="phone-frame__speaker" aria-hidden="true" />
            <HelperView state={state} embedded />
          </div>
        </div>
      </section>
      <footer className="demo-footer">
        <p className="narration"><span>讲解提示</span>{narration[state.demoStage]}</p>
        {(state.demoStage === 'accepted' || state.demoStage === 'completed') && <ScenarioClose />}
      </footer>
    </main>
  )
}
