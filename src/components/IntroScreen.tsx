import { association } from '../data/sponsor'
import type { CSSProperties } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Heart, Sparkles } from 'lucide-react'
import { useIntroCountdown } from '../hooks/useIntroCountdown'
import '../styles/intro.css'

interface IntroScreenProps {
  onComplete: () => void
}

const particles = Array.from({ length: 30 }, (_, index) => ({
  x: (index * 37 + 11) % 100,
  y: (index * 19 + 7) % 100,
  delay: -(index % 7),
  duration: 7 + (index % 5),
}))

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const { progress, secondsRemaining } = useIntroCountdown(onComplete)
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      className="intro-screen"
      data-testid="intro-screen"
      aria-labelledby="intro-title"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.35 }}
    >
      <div className="intro-grid" aria-hidden="true" />
      <svg
        className="intro-circuits"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M0 180H250L370 300H490M0 240H210L330 360H445M0 710H220L360 570H490M1440 180H1190L1070 300H950M1440 240H1230L1110 360H995M1440 710H1220L1080 570H950" />
          <path d="M170 0V160L290 280V450H410M1270 0V160L1150 280V450H1030M150 900V760L300 610V520M1290 900V760L1140 610V520" />
          <path
            className="intro-circuit-signal"
            d="M0 240H210L330 360H445M1440 710H1220L1080 570H950M1270 0V160L1150 280V450H1030"
          />
        </g>
        <g fill="currentColor">
          <circle cx="490" cy="300" r="4" />
          <circle cx="445" cy="360" r="4" />
          <circle cx="490" cy="570" r="4" />
          <circle cx="950" cy="300" r="4" />
          <circle cx="995" cy="360" r="4" />
          <circle cx="950" cy="570" r="4" />
          <circle cx="410" cy="450" r="4" />
          <circle cx="1030" cy="450" r="4" />
        </g>
      </svg>
      <div className="intro-particles" aria-hidden="true">
        {particles.map((particle, index) => (
          <span
            key={index}
            style={
              {
                '--particle-x': `${particle.x}%`,
                '--particle-y': `${particle.y}%`,
                '--particle-delay': `${particle.delay}s`,
                '--particle-duration': `${particle.duration}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="intro-topline">
        <span /> 为每一份热爱，连接未来
      </div>
      <motion.div
        className="intro-content"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="intro-emblem-wrap">
          <div className="intro-orbit intro-orbit-outer" aria-hidden="true" />
          <div className="intro-orbit intro-orbit-inner" aria-hidden="true" />
          <img
            className="intro-emblem"
            src={`${import.meta.env.BASE_URL}${association.logo}`}
            alt={association.name + '徽标'}
            width="120"
            height="120"
          />
          <span className="intro-emblem-label">始于 1985</span>
        </div>
        <p className="intro-eyebrow">
          <Sparkles size={15} aria-hidden="true" /> 赞助者专属空间
        </p>
        <h1 id="intro-title">
          鲁东大学<span>电子科技协会</span>
        </h1>
        <p className="intro-subtitle" lang="en">
          Ludong University · Electronics Technology Association
        </p>
        <p className="intro-welcome">
          <Heart size={16} aria-hidden="true" />{' '}
          感谢您的支持，让探索与热爱继续闪光。
        </p>
        <div className="intro-loading">
          <div className="intro-countdown-row">
            <span>正在开启专属主页</span>
            <span className="intro-countdown">
              <strong data-testid="intro-countdown">{secondsRemaining}</strong>{' '}
              秒
            </span>
          </div>
          <div
            className="intro-progress"
            role="progressbar"
            aria-label="欢迎动画进度"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
          >
            <span style={{ transform: `scaleX(${progress})` }} />
          </div>
          <p
            className="intro-countdown-status"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {secondsRemaining > 0
              ? `${secondsRemaining} 秒后自动进入主页`
              : '欢迎进入主页'}
          </p>
        </div>
      </motion.div>
      <p className="intro-footer">科技连接彼此 · 支持成就可能</p>
    </motion.section>
  )
}
