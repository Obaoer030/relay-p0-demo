import { BookOpenText, Database, ExternalLink, RotateCcw, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../app/PageHeader'
import { useWorkspace } from '../workspace/WorkspaceContext'

export function WorkspaceSettings() {
  const { state, dispatch } = useWorkspace()
  const reset = () => {
    if (window.confirm('确定恢复全部演示数据吗？你创建的本地事项会被替换。')) dispatch({ type: 'reset' })
  }
  return (
    <main className="workspace-page">
      <PageHeader eyebrow="本地完整演示" title="设置与说明" description="你的操作保存在当前浏览器。上线后的账号与云同步需要独立后端。" />
      <div className="workspace-settings-grid">
        <section className="workspace-panel workspace-settings-card"><Database size={22} /><div><h2>演示数据</h2><p>{state.matters.length} 个事项、{state.people.length} 位关系人、{state.activity.length} 条活动保存在 localStorage。</p></div><button className="workspace-secondary-action" type="button" onClick={reset}><RotateCcw size={17} /> 恢复演示数据</button></section>
        <section className="workspace-panel workspace-settings-card"><Smartphone size={22} /><div><h2>减少动态效果</h2><p>关闭责任点位移动画，但保留人物、实心点和状态文字。</p></div><label className="workspace-switch"><input type="checkbox" checked={state.reduceMotion} onChange={(event) => dispatch({ type: 'set-reduce-motion', value: event.target.checked })} /><span />{state.reduceMotion ? '已开启' : '未开启'}</label></section>
        <section className="workspace-panel workspace-settings-card"><BookOpenText size={22} /><div><h2>产品设计背景</h2><p>了解 Relay 为什么不等同于微信聊天或普通待办。</p></div><Link className="workspace-secondary-action" to="/about">阅读产品故事 <ExternalLink size={16} /></Link></section>
        <section className="workspace-panel workspace-settings-card"><ExternalLink size={22} /><div><h2>90 秒路演舞台</h2><p>双手机同步展示布丁复诊的有边界接棒。</p></div><Link className="workspace-secondary-action" to="/demo">打开演示舞台 <ExternalLink size={16} /></Link></section>
      </div>
    </main>
  )
}
