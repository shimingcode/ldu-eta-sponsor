import { ArrowUpRight, GitCommitHorizontal } from 'lucide-react'
import type { Sponsor } from '../data/sponsor'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
export function ContributionTimeline({ sponsor }: { sponsor: Sponsor }) {
  return (
    <section className="section timeline-section" id="contributions">
      <div className="shell">
        <Reveal>
          <SectionHeading
            number="02"
            eyebrow="THE JOURNEY TOGETHER"
            title="每一步支持，都有回响"
            description={
              sponsor.isPlaceholder
                ? '以下为结构示例，具体赞助事实与时间待确认。'
                : '记录真实的支持，也记住每一次同行。'
            }
          />
        </Reveal>
        {sponsor.contributions?.length ? (
          <ol className="timeline-grid">
            {sponsor.contributions.map((item, i) => (
              <li key={item.id}>
                <Reveal>
                  <div className="timeline-axis">
                    <span className="timeline-dot" />
                    <span className="mono">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <time>{item.date}</time>
                  </div>
                  <article className="contribution-card glass">
                    {item.category && (
                      <span className="tag">{item.category}</span>
                    )}
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <ArrowUpRight
                      className="card-arrow"
                      size={21}
                      aria-hidden="true"
                    />
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        ) : (
          <div className="empty-state glass">
            <GitCommitHorizontal size={30} aria-hidden="true" />
            <h3>同行的故事，等待记录</h3>
            <p>尚未公开赞助贡献记录。</p>
          </div>
        )}
      </div>
    </section>
  )
}
