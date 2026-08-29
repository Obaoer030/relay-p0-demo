import { Activity, BookOpenText, CircleUserRound, Handshake, LayoutDashboard, ListChecks, MonitorPlay, Plus, Settings } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'
import { PerspectiveSwitcher } from './PerspectiveSwitcher'
import { useWorkspace } from '../workspace/WorkspaceContext'

const links = [
  { to: '/', label: '总览', icon: LayoutDashboard, end: true },
  { to: '/matters', label: '事项', icon: ListChecks },
  { to: '/handoffs', label: '协作', icon: Handshake },
  { to: '/people', label: '关系人', icon: CircleUserRound },
  { to: '/activity', label: '动态', icon: Activity },
]

export function AppShell() {
  const location = useLocation()
  const { syncMode } = useWorkspace()
  const currentLabel = links.find((link) => link.end ? location.pathname === link.to : location.pathname.startsWith(link.to))?.label
    ?? (location.pathname === '/about' ? '产品故事' : location.pathname === '/settings' ? '设置' : '事项详情')

  return (
    <div className="workspace-app">
      <div className="workspace-signal-field" aria-hidden="true" />

      <header className="workspace-system-rail">
        <div className="workspace-system-brand">
          <BrandMark />
          <span>R/OS<br /><small>版本 2.0</small></span>
        </div>
        <nav aria-label="产品导航">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive ? 'is-active' : ''}>
              <span className="workspace-system-icon"><Icon size={17} aria-hidden="true" /></span>
              <span>{label}</span>
              <i className="workspace-system-state" aria-hidden="true" />
            </NavLink>
          ))}
        </nav>
        <div className="workspace-system-actions">
          <NavLink to="/about" aria-label="产品故事"><BookOpenText size={17} /></NavLink>
          <NavLink to="/settings" aria-label="设置"><Settings size={17} /></NavLink>
          <NavLink to="/demo" className="workspace-demo-link"><MonitorPlay size={16} /><span>完整演示</span></NavLink>
        </div>
      </header>

      <div className="workspace-main">
        <header className="workspace-topbar">
          <div className="workspace-breadcrumb">
            <span>RELAY</span><i>/</i><strong>{currentLabel}</strong>
          </div>
          <div className="workspace-topbar__status">
            <span className="workspace-local-status"><i /> {syncMode === 'room' ? '演示房间在线' : syncMode === 'connecting' ? '正在连接' : '本地模式'}</span>
            <span className="workspace-shared-state">{syncMode === 'room' ? '手机与电脑共享' : '当前设备共享数据'}</span>
            <PerspectiveSwitcher />
          </div>
        </header>
        <header className="workspace-mobile-header">
          <BrandMark compact />
          <div className="workspace-mobile-header__actions">
            <PerspectiveSwitcher compact />
            <NavLink to="/settings" aria-label="设置"><Settings size={20} /></NavLink>
          </div>
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
