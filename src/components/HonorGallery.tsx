import { Award } from 'lucide-react'
import type { Sponsor } from '../data/sponsor'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
export function HonorGallery({ sponsor }: { sponsor: Sponsor }) {
  return (
    <section className="shell section" id="honors">
      <Reveal>
        <SectionHeading
          number="03"
          eyebrow="MOMENTS OF RECOGNITION"
          title="荣誉，是感谢的另一种表达"
        />
        {sponsor.honors?.length ? (
          <div className="honor-grid">
            {sponsor.honors.map((honor) => (
              <article className="honor-card glass" key={honor.id}>
                <Award size={34} aria-hidden="true" />
                <h3>{honor.title}</h3>
                {honor.description && <p>{honor.description}</p>}
                <div className="muted">
                  {honor.issuer}
                  {honor.date && <time> · {honor.date}</time>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="honor-empty">
            <div className="honor-emblem" aria-hidden="true">
              <Award size={40} strokeWidth={1.25} />
            </div>
            <div>
              <p className="eyebrow">留一处位置，给真实的荣光</p>
              <h3>荣誉资料待补充</h3>
              <p>经核实的荣誉与致谢记录将在这里展示。</p>
            </div>
            <span className="honor-watermark mono" aria-hidden="true">
              HONOR
            </span>
          </div>
        )}
      </Reveal>
    </section>
  )
}
