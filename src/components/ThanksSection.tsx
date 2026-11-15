import { association } from '../data/sponsor'
import { ArrowUp, Heart } from 'lucide-react'
import type { Sponsor } from '../data/sponsor'
import { Reveal } from './Reveal'
export function ThanksSection({ sponsor }: { sponsor: Sponsor }) {
  return (
    <section className="thanks-section section" id="thanks">
      <Reveal className="shell thanks-inner">
        <div className="thanks-icon">
          <Heart size={25} strokeWidth={1.5} aria-hidden="true" />
        </div>
        <p className="eyebrow">WITH GRATITUDE, ALWAYS</p>
        <h2>感谢你，让热爱有了回响。</h2>
        <p className="thanks-message">
          {sponsor.message ||
            '感谢每一份对青年探索与创新的关注。协会感谢寄语待补充。'}
        </p>
        <div className="association-story">
          <h3>{association.motto}</h3>
          <p>{association.introduction}</p>
        </div>
        <div className="thanks-signature">
          <span />
          <p>鲁东大学电子科技协会</p>
          <span />
        </div>
        {sponsor.isPlaceholder && (
          <p className="sample-note">
            当前寄语为展示文案，正式内容待协会确认。
          </p>
        )}
        <a className="back-top" href="#home" aria-label="返回页面顶部">
          <ArrowUp size={18} />
        </a>
      </Reveal>
    </section>
  )
}
