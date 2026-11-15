import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { assetUrl } from '../data/assets'
const links = [
  { id: 'about', label: '关于赞助者' },
  { id: 'contributions', label: '支持足迹' },
  { id: 'honors', label: '荣誉时刻' },
  { id: 'activities', label: '协会活动' },
]
export function Navbar() {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    const media = window.matchMedia('(min-width: 900px)')
    function closeOnDesktop() {
      if (media.matches) setOpen(false)
    }
    document.addEventListener('keydown', escape)
    media.addEventListener('change', closeOnDesktop)
    return () => {
      document.removeEventListener('keydown', escape)
      media.removeEventListener('change', closeOnDesktop)
    }
  }, [open])
  return (
    <header className="site-header">
      <nav className="shell nav-inner" aria-label="主导航">
        <a
          className="brand"
          href="#home"
          aria-label="鲁东大学电子科技协会，返回首页"
          onClick={() => setOpen(false)}
        >
          <img
            src={assetUrl('images/association-placeholder.svg')}
            alt="协会徽标占位"
            width="42"
            height="42"
          />
          <span>
            鲁东大学<span className="brand-sub">电子科技协会</span>
          </span>
        </a>
        <div className="desktop-links">
          {links.map((link) => (
            <a key={link.id} href={`#${link.id}`}>
              {link.label}
            </a>
          ))}
        </div>
        <a className="nav-thanks" href="#thanks">
          致谢寄语 <ArrowUpRight size={15} aria-hidden="true" />
        </a>
        <button
          className="menu-toggle"
          type="button"
          ref={toggle}
          aria-label={open ? '关闭菜单' : '打开菜单'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        {open && (
          <div className="mobile-menu" id="mobile-menu">
            {[...links, { id: 'thanks', label: '致谢寄语' }].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
              >
                {link.label}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}
