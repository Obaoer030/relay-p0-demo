import { Bell, Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import { BrandMark } from './BrandMark'

export function ProductChrome({
  children,
  onCapture,
  hideNavigation = false,
}: {
  children: ReactNode
  onCapture?: () => void
  hideNavigation?: boolean
}) {
  return (
    <div className="product-screen">
      <header className="product-header">
        <BrandMark compact />
        <button className="icon-button" type="button" aria-label="通知（演示中无新通知）">
          <Bell size={19} strokeWidth={1.7} />
        </button>
      </header>
      <div className="product-content">{children}</div>
      {!hideNavigation && (
        <nav className="bottom-nav" aria-label="主导航">
          <span className="bottom-nav__item is-active">今天</span>
          <button className="capture-button" type="button" onClick={onCapture} aria-label="倒出一件事">
            <Plus size={22} strokeWidth={2} />
          </button>
          <span className="bottom-nav__item">我的</span>
        </nav>
      )}
    </div>
  )
}
