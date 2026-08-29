import { ArrowUpRight, Check, Feather } from 'lucide-react'
import { HERO_MATTER_ID } from '../domain/seed'
import type { Matter, RelayState } from '../domain/types'
import { MatterCard } from '../components/MatterCard'
import { ProductChrome } from '../components/ProductChrome'

function Section({
  title,
  count,
  children,
  empty,
}: {
  title: string
  count: number
  children: React.ReactNode
  empty: string
}) {
  return (
    <section className="matter-section">
      <div className="matter-section__heading">
        <h2>{title}</h2>
        <span>{count}</span>
      </div>
      {count > 0 ? children : <p className="matter-section__empty">{empty}</p>}
    </section>
  )
}

const heroFirst = (matters: Matter[]) =>
  [...matters].sort((a, b) => Number(b.id === HERO_MATTER_ID) - Number(a.id === HERO_MATTER_ID))

export function TodayView({ state, onStart }: { state: RelayState; onStart: () => void }) {
  const mine = heroFirst(state.matters.filter((matter) => matter.status === 'mine'))
  const waiting = heroFirst(state.matters.filter((matter) => matter.status === 'waiting'))
  const relayed = heroFirst(state.matters.filter((matter) => matter.status === 'relayed'))
  const history = state.matters.find((matter) => matter.id === 'matter-cat-feeding-history')!

  const renderCards = (matters: Matter[]) =>
    matters.map((matter) => (
      <MatterCard
        key={matter.id}
        matter={matter}
        stage={state.demoStage}
        reduceMotion={state.reduceMotion}
        hero={matter.id === HERO_MATTER_ID}
      />
    ))

  return (
    <ProductChrome onCapture={onStart}>
      <section className="today-intro">
        <div>
          <p className="micro-label">8 月 · 今天</p>
          <h1>早上好，林然</h1>
        </div>
        <span className="today-intro__mark" aria-hidden="true">R</span>
      </section>

      {state.demoStage === 'declined' && (
        <div className="gentle-alert" role="status">
          小雨这次暂时无法帮忙。事情已回到“需要我推进”。
        </div>
      )}

      {state.demoStage === 'accepted' && (
        <div className="release-note" role="status">
          <Feather size={18} aria-hidden="true" />
          <p><strong>这件事已经有人推进。</strong>除非超出约定边界，你不需要主动追问。</p>
        </div>
      )}

      {state.demoStage === 'completed' && (
        <div className="release-note release-note--complete" role="status">
          <Check size={18} aria-hidden="true" />
          <p><strong>布丁已完成复诊并安全回家。</strong>小雨发回了复诊结论。</p>
        </div>
      )}

      {state.demoStage === 'initial' && (
        <button className="capture-prompt" type="button" onClick={onStart}>
          <span>
            <small>先倒出来，不用现在就整理好</small>
            周五出差，想请小雨接住布丁复诊
          </span>
          <ArrowUpRight size={20} aria-hidden="true" />
        </button>
      )}

      <div className="matter-sections">
        <Section title="需要我推进" count={mine.length} empty="现在没有需要你继续推的事">
          {renderCards(mine)}
        </Section>
        <Section title="等待对方回应" count={waiting.length} empty="没有悬着的回应">
          {renderCards(waiting)}
        </Section>
        <Section title="已有人接住" count={relayed.length} empty="接棒后，会在这里清楚显示">
          {renderCards(relayed)}
        </Section>
      </div>

      <div className="trust-history" aria-label="可信协作历史">
        <Check size={15} aria-hidden="true" />
        <span>{history.title}</span>
        <strong>小雨 · 已完成</strong>
      </div>
    </ProductChrome>
  )
}
