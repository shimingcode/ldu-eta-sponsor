import { useEffect, useRef, useState } from 'react'

export const INTRO_DURATION_MS = 5_000

/** A monotonic deadline keeps background-tab throttling from extending the intro. */
export function useIntroCountdown(onComplete: () => void) {
  const callbackRef = useRef(onComplete)
  const startedAtRef = useRef<number | null>(null)
  const completedRef = useRef(false)
  const [progress, setProgress] = useState(0)
  const [secondsRemaining, setSecondsRemaining] = useState(5)

  useEffect(() => {
    callbackRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    // Preserve the original deadline across StrictMode's setup/cleanup rehearsal.
    startedAtRef.current ??= performance.now()
    const deadline = startedAtRef.current + INTRO_DURATION_MS
    let disposed = false
    let frameId = 0
    let timeoutId = 0

    const update = () => {
      if (disposed || completedRef.current) return
      const remaining = Math.max(0, deadline - performance.now())
      setProgress(1 - remaining / INTRO_DURATION_MS)
      setSecondsRemaining(Math.ceil(remaining / 1_000))
      if (remaining === 0) {
        completedRef.current = true
        window.clearTimeout(timeoutId)
        cancelAnimationFrame(frameId)
        callbackRef.current()
      }
    }

    const animate = () => {
      update()
      if (!disposed && !completedRef.current) {
        frameId = requestAnimationFrame(animate)
      }
    }

    const checkDeadline = () => {
      update()
      if (!disposed && !completedRef.current) {
        // Timers may occasionally fire early; never finish before 5,000 ms.
        timeoutId = window.setTimeout(
          checkDeadline,
          Math.max(1, deadline - performance.now()),
        )
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') update()
    }

    frameId = requestAnimationFrame(animate)
    timeoutId = window.setTimeout(
      checkDeadline,
      Math.max(0, deadline - performance.now()),
    )
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      disposed = true
      cancelAnimationFrame(frameId)
      window.clearTimeout(timeoutId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return { progress, secondsRemaining }
}
