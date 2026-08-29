import { ArrowRight, Check, MessageCircle, ShieldCheck, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../app/PageHeader'

const comparisons = [
  ['组织方式', '按时间排列消息', '按事项保存持续状态'],
  ['责任', '通常靠语气和上下文推断', '明确显示当前下一步责任人'],
  ['接受与完成', '容易混在一句“好的”里', '等待、接受、完成分别记录'],
  ['必要信息', '资料散落在历史消息中', '背景、行动、材料和完成标准集中'],
  ['边界', '常在反复沟通中补充', '分享前明确哪些决定不能代替'],
]

export function WorkspaceAbout() {
  return (
    <main className="workspace-page workspace-about">
      <PageHeader eyebrow="Relay · 接棒" title="让责任离开聊天流，成为可见的生活状态" description="聊天保存我们说过什么；Relay 保存事情现在由谁推进，以及发起者是否还需要行动。" actions={<Link className="workspace-primary-action" to="/demo">体验一次接棒 <ArrowRight size={17} /></Link>} />
      <section className="workspace-about-hero"><div><p className="micro-label">设计背景</p><h2>有些累，不是事情太多，而是所有事情都要你一直记着。</h2><p>生活事项跨越多人、多天和多个决定。发出消息后，发起者往往仍要解释、确认和追问。Relay 把隐形协调劳动变成一个可见的责任结构。</p></div><div className="workspace-about-formula"><span>上下文</span><i>+</i><span>下一步</span><i>+</i><span>责任人</span><i>+</i><span>完成标准</span><i>+</i><span>边界</span></div></section>
      <section className="workspace-comparison"><header><MessageCircle size={23} /><div><p className="micro-label">不是替代微信，而是补上状态层</p><h2>微信聊天与 Relay</h2></div></header><div className="workspace-comparison-table"><div className="is-heading"><span>维度</span><span>微信聊天</span><span>Relay</span></div>{comparisons.map(([label, chat, relay]) => <div key={label}><strong>{label}</strong><span>{chat}</span><span><Check size={15} /> {relay}</span></div>)}</div></section>
      <section className="workspace-scenario-grid"><article><span>01</span><h2>宠物与临时出差</h2><p>朋友接住复诊执行，手术和重大费用仍由主人决定。</p></article><article><span>02</span><h2>异地父母照护</h2><p>兄弟姐妹接住取报告、陪同或线下手续。</p></article><article><span>03</span><h2>住房与搬家</h2><p>等待房东、室友验房和物品交接都有持续状态。</p></article><article><span>04</span><h2>伴侣共同生活</h2><p>采购、预约和跟进明确由谁推进，不靠默认记忆。</p></article></section>
      <section className="workspace-mobile-explainer"><Smartphone size={30} /><div><p className="micro-label">为什么先做响应式 Web</p><h2>一个网址，手机和电脑都能直接打开。</h2><p>微信小程序需要平台账号、配置和审核，适合正式微信分发；响应式 Web 可以复用同一套代码，更适合本次评选和后续服务器部署。</p></div><ShieldCheck size={28} /></section>
    </main>
  )
}
