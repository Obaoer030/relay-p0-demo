import { ArrowRight, Check, MessageCircle, ShieldCheck, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../app/PageHeader'

const comparisons = [
  ['组织方式', '按时间排列消息', '按事项保存持续状态'],
  ['负责人', '通常靠语气和上下文推断', '明确显示下一步由谁负责'],
  ['接受与完成', '容易混在一句“好的”里', '等待、接受、完成分别记录'],
  ['必要信息', '资料散落在历史消息中', '背景、行动、材料和完成标准集中'],
  ['需要重新联系的情况', '常在反复沟通中补充', '发出前明确哪些决定不能代替'],
]

export function WorkspaceAbout() {
  return (
    <main className="workspace-page workspace-about">
      <PageHeader eyebrow="Relay · 生活事项协作" title="让聊天里说好的事，有清楚的负责人和进度" description="聊天保存我们说过什么；Relay 记录下一步现在由谁负责，以及你是否还需要行动。" actions={<Link className="workspace-primary-action" to="/demo">体验一次协作 <ArrowRight size={17} /></Link>} />
      <section className="workspace-about-hero"><div><p className="micro-label">设计背景</p><h2>有些累，不是事情太多，而是所有事情都要你一直记着。</h2><p>生活事项经常跨越多人和多天。消息发出去以后，你仍可能要补充背景、确认对方是否答应、记住什么时候再问。Relay 把这些信息放进同一件事项，让双方随时看见下一步和负责人。</p></div><div className="workspace-about-formula"><span>为什么要做</span><i>+</i><span>下一步</span><i>+</i><span>谁负责</span><i>+</i><span>做到哪里</span><i>+</i><span>何时联系我</span></div></section>
      <section className="workspace-comparison"><header><MessageCircle size={23} /><div><p className="micro-label">不是替代微信，而是补上状态层</p><h2>微信聊天与 Relay</h2></div></header><div className="workspace-comparison-table"><div className="is-heading"><span>维度</span><span>微信聊天</span><span>Relay</span></div>{comparisons.map(([label, chat, relay]) => <div key={label}><strong>{label}</strong><span>{chat}</span><span><Check size={15} /> {relay}</span></div>)}</div></section>
      <section className="workspace-scenario-grid"><article><span>01</span><h2>宠物与临时出差</h2><p>朋友负责带宠物复诊，手术和重大费用仍由主人决定。</p></article><article><span>02</span><h2>异地父母照护</h2><p>兄弟姐妹负责取报告、陪同或办理线下手续。</p></article><article><span>03</span><h2>住房与搬家</h2><p>等待房东回复、室友验房和物品交接都有清楚状态。</p></article><article><span>04</span><h2>伴侣共同生活</h2><p>采购、预约和后续跟进明确由谁负责，不靠默认记忆。</p></article></section>
      <section className="workspace-mobile-explainer"><Smartphone size={30} /><div><p className="micro-label">为什么先做响应式 Web</p><h2>一个网址，手机和电脑都能直接打开。</h2><p>微信小程序需要平台账号、配置和审核，适合正式微信分发；响应式 Web 可以复用同一套代码，更适合本次评选和后续服务器部署。</p></div><ShieldCheck size={28} /></section>
    </main>
  )
}
