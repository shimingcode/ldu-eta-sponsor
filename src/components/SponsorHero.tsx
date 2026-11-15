import { ArrowDown, ArrowUpRight, Heart, Sparkles } from 'lucide-react'
import type { Sponsor } from '../data/sponsor'
import { assetUrl } from '../data/assets'
import { LocalImage } from './LocalImage'
export function SponsorHero({ sponsor }: { sponsor: Sponsor }) {
  const cover = assetUrl(sponsor.cover)
  return (
    <section className="hero" id="home" aria-labelledby="sponsor-name">
      {cover && (
        <div
          className="hero-cover"
          style={{ backgroundImage: `url("${cover}")` }}
          aria-hidden="true"
        />
      )}
      <div className="shell hero-grid">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">
            <span className="status-dot" /> 因热爱相遇 · 为探索同行
          </p>
          <p className="hero-intro">每一份支持，都让未来</p>
          <p className="hero-statement">
            多一种<span>可能。</span>
          </p>
          <div className="sponsor-identity">
            <span className="identity-line" />
            <div>
              <p className="identity-caption">本页致敬</p>
              <h1 id="sponsor-name" tabIndex={-1}>
                {sponsor.name || '赞助者姓名待补充'}
              </h1>
            </div>
            {sponsor.isPlaceholder && (
              <span className="sample-badge">示例档案</span>
            )}
          </div>
          {sponsor.title && <p className="hero-role">{sponsor.title}</p>}
          <p className="hero-description">
            一份信任，一路同行。
            <br />
            这里珍藏着支持者与电子科技探索之间的联结。
          </p>
          <div className="hero-actions">
            <a href="#about" className="button button-primary">
              认识这位同行者 <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a href="#contributions" className="text-link">
              查看支持足迹 <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="hero-signoff">
            <Heart size={14} aria-hidden="true" />
            <span>以热爱为起点，以感谢为回响</span>
          </div>
        </div>
        <div className="portrait-stage">
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <div className="portrait-frame">
            <div className="portrait-top">
              <span className="status-dot" />
              <span>同行者 · 专属档案</span>
              <span className="mono">01</span>
            </div>
            <LocalImage
              path={sponsor.avatar}
              eager
              alt={
                sponsor.isPlaceholder
                  ? '赞助者人物肖像占位，非真实人物'
                  : `${sponsor.name || '赞助者'}的授权肖像`
              }
              className="portrait-image"
            />
            <div className="portrait-caption">
              <span>{sponsor.nickname || '感谢每一份信任'}</span>
              <span className="mono">LDU / ETA</span>
            </div>
          </div>
          {sponsor.isPlaceholder && (
            <span className="portrait-placeholder">
              人物肖像占位 · 非真实人物
            </span>
          )}
          <div className="portrait-note glass">
            <Sparkles size={19} aria-hidden="true" />
            <div>
              <strong>让探索，拥有更多可能</strong>
              <span>感谢与青年创新同行</span>
            </div>
          </div>
          <div className="portrait-coordinate mono" aria-hidden="true">
            PERSONAL ARCHIVE / 001
          </div>
        </div>
      </div>
      <div className="shell hero-bottom">
        <span className="mono">
          LUDONG UNIVERSITY · ELECTRONIC TECHNOLOGY ASSOCIATION
        </span>
        <a href="#about">
          向下探索 <ArrowDown size={14} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
