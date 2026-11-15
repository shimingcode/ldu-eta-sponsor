import {
  ArrowUpRight,
  CalendarDays,
  Fingerprint,
  HeartHandshake,
} from 'lucide-react'
import type { Sponsor } from '../data/sponsor'
import { safeContactUrl } from '../data/assets'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
export function SponsorProfile({ sponsor }: { sponsor: Sponsor }) {
  const contacts = (sponsor.contactLinks ?? []).filter(
    (link) => link.authorized && safeContactUrl(link.url),
  )
  return (
    <section className="shell section" id="about">
      <Reveal>
        <SectionHeading
          number="01"
          eyebrow="ABOUT THE SPONSOR"
          title="相识于热爱，同行于未来"
          description="一位同行者，一段值得被记住的故事。"
        />
        <div className="profile-grid">
          <div className="profile-mark">
            <Fingerprint size={54} strokeWidth={1} aria-hidden="true" />
            <p>
              支持的背后，
              <br />
              <strong>是对可能性的相信。</strong>
            </p>
            <span className="mono">A SHARED BELIEF</span>
          </div>
          <div className="profile-copy">
            {sponsor.biography?.filter(Boolean).length ? (
              sponsor.biography
                .filter(Boolean)
                .map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p className="muted">
                个人介绍待补充。经本人确认和授权后，将在这里分享真实的故事。
              </p>
            )}
            <div className="profile-meta">
              <span>
                <HeartHandshake size={17} aria-hidden="true" />
                {sponsor.nickname || '感谢与我们同行'}
              </span>
              {sponsor.sponsorSince && (
                <span>
                  <CalendarDays size={16} aria-hidden="true" />自{' '}
                  {sponsor.sponsorSince} 起同行
                </span>
              )}
            </div>
            {contacts.length > 0 && (
              <div className="contact-links" aria-label="经授权公开的联系方式">
                {contacts.map((link, i) => (
                  <a
                    className="text-link"
                    key={i}
                    href={safeContactUrl(link.url)}
                    target={
                      link.url.startsWith('https:') ? '_blank' : undefined
                    }
                    rel="noopener noreferrer"
                  >
                    {link.label}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
