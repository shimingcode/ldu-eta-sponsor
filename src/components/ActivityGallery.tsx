import { Images } from 'lucide-react'
import type { Sponsor } from '../data/sponsor'
import { LocalImage } from './LocalImage'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
export function ActivityGallery({ sponsor }: { sponsor: Sponsor }) {
  return (
    <section className="shell section" id="activities">
      <Reveal>
        <SectionHeading
          number="04"
          eyebrow="IDEAS COME TO LIFE"
          title="在这里，让热爱发生"
          description="从一块电路板，到一个新的想法。"
        />
      </Reveal>
      {sponsor.activities?.length ? (
        <div className="activity-grid">
          {sponsor.activities.map((activity, i) => (
            <Reveal key={activity.id}>
              <article className="activity-card">
                <div className="activity-image-wrap">
                  <LocalImage
                    path={activity.image}
                    alt={activity.imageAlt || activity.title}
                    className="activity-image"
                  />
                  {sponsor.isPlaceholder && (
                    <span className="activity-badge">
                      活动示意 · 非真实记录
                    </span>
                  )}
                </div>
                <div className="activity-body">
                  <span className="activity-number mono">
                    /{String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    {activity.date && (
                      <time className="eyebrow">{activity.date}</time>
                    )}
                    <h3>{activity.title}</h3>
                    {activity.description && <p>{activity.description}</p>}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="empty-state glass">
          <Images size={28} aria-hidden="true" />
          <h3>下一次精彩，等待分享</h3>
          <p>暂无已公开的协会活动资料。</p>
        </div>
      )}
    </section>
  )
}
