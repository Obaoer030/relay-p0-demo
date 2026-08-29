import { Activity, BookOpenText, CircleUserRound, Handshake, LayoutDashboard, ListChecks, Plus, Settings } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'

const links = [
  { to: '/', label: '总览', icon: LayoutDashboard, end: true },
  { to: '/matters', label: '事项', icon: ListChecks },
  { to: '/handoffs', label: '接棒', icon: Handshake },
  { to: '/people', label: '关系人', icon: CircleUserRound },
  { to: '/activity', label: '动态', icon: Activity },
]

export function AppShell() {
  return (
    <div className="workspace-app">
      <aside className="workspace-sidebar">
        <BrandMark />
        <p className="workspace-sidebar__caption">把生活里的下一步，交给说好的人。</p>
        <nav aria-label="产品导航">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive ? 'is-active' : ''}>
              <Icon size={19} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="workspace-sidebar__bottom">
          <NavLink to="/about"><BookOpenText size={18} /> 产品故事</NavLink>
          <NavLink to="/settings"><Settings size={18} /> 设置</NavLink>
          <NavLink to="/demo" className="workspace-demo-link">打开路演舞台</NavLink>
        </div>
      </aside>

      <div className="workspace-main">
        <header className="workspace-mobile-header">
          <BrandMark compact />
          <NavLink to="/settings" aria-label="设置"><Settings size={20} /></NavLink>
        </header>
        <Outlet />
      </div>

      <NavLink className="workspace-fab" to="/matters/new" aria-label="新建事项">
        <Plus size={23} />
      </NavLink>
      <nav className="workspace-bottom-nav" aria-label="移动端产品导航">
        {links.slice(0, 4).map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive ? 'is-active' : ''}>
            <Icon size={20} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
