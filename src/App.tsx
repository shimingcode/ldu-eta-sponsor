import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'motion/react'
import { sponsor as defaultSponsor, type Sponsor } from './data/sponsor'
import { IntroScreen } from './components/IntroScreen'
import { Navbar } from './components/Navbar'
import { SponsorHero } from './components/SponsorHero'
import { SponsorProfile } from './components/SponsorProfile'
import { ContributionTimeline } from './components/ContributionTimeline'
import { HonorGallery } from './components/HonorGallery'
import { ActivityGallery } from './components/ActivityGallery'
import { ThanksSection } from './components/ThanksSection'
import { Footer } from './components/Footer'

export function SponsorPage({
  sponsor = defaultSponsor,
}: {
  sponsor?: Sponsor
}) {
  return (
    <>
      <a href="#main" className="skip-link">
        跳转到主要内容
      </a>
      <Navbar />
      <main id="main">
        <SponsorHero sponsor={sponsor} />
        <SponsorProfile sponsor={sponsor} />
        <ContributionTimeline sponsor={sponsor} />
        <HonorGallery sponsor={sponsor} />
        <ActivityGallery sponsor={sponsor} />
        <ThanksSection sponsor={sponsor} />
      </main>
      <Footer sponsor={sponsor} />
    </>
  )
}
export default function App() {
  const [intro, setIntro] = useState(true)
  const [transitioned, setTransitioned] = useState(false)
  const page = useRef<HTMLDivElement>(null)
  const finish = useCallback(() => setIntro(false), [])
  useEffect(() => {
    if (!intro) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [intro])
  useEffect(() => {
    if (transitioned) {
      page.current
        ?.querySelector<HTMLElement>('#sponsor-name')
        ?.focus({ preventScroll: true })
      const hash = window.location.hash.slice(1)
      if (hash)
        document.getElementById(hash)?.scrollIntoView({ behavior: 'instant' })
    }
  }, [transitioned])
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence onExitComplete={() => setTransitioned(true)}>
        {intro && <IntroScreen key="intro" onComplete={finish} />}
      </AnimatePresence>
      {!intro && (
        <div ref={page}>
          <SponsorPage />
        </div>
      )}
    </MotionConfig>
  )
}
