import { Cpu } from 'lucide-react'
import type { Sponsor } from '../data/sponsor'
const currentYear = new Date().getFullYear()
export function Footer({ sponsor }: { sponsor: Sponsor }) {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-top">
          <a href="#home" className="footer-brand">
            <Cpu size={21} aria-hidden="true" />
            鲁东大学电子科技协会
          </a>
          <span>探索不止 · 感谢常在</span>
        </div>
        <div className="footer-bottom">
          <p>© {currentYear} 鲁东大学电子科技协会 · 赞助者专属网站</p>
          <p>
            {sponsor.isPlaceholder
              ? '展示样稿：人物、徽标与活动图均为占位素材；不代表真实赞助事实。'
              : '仅展示经确认的资料与获授权公开的联系方式。'}
          </p>
        </div>
      </div>
    </footer>
  )
}
