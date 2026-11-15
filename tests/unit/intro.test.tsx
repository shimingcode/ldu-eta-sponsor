import { StrictMode } from 'react'
import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  INTRO_DURATION_MS,
  useIntroCountdown,
} from '../../src/hooks/useIntroCountdown'

function CountdownHarness({ onComplete }: { onComplete: () => void }) {
  const { progress, secondsRemaining } = useIntroCountdown(onComplete)
  return (
    <>
      <output data-testid="seconds">{secondsRemaining}</output>
      <output data-testid="progress">{progress}</output>
    </>
  )
}

function advance(milliseconds: number) {
  act(() => {
    vi.advanceTimersByTime(milliseconds)
  })
}

describe('five-second intro deadline', () => {
  it('streams smooth progress without rendering React on every frame', () => {
    const onProgress = vi.fn()
    const onComplete = vi.fn()
    let renders = 0
    function StreamingHarness() {
      renders++
      const { secondsRemaining } = useIntroCountdown(onComplete, onProgress)
      return <output>{secondsRemaining}</output>
    }
    render(<StreamingHarness />)
    for (let i = 0; i < 50; i++) advance(16)
    expect(onProgress.mock.calls.length).toBeGreaterThan(40)
    expect(renders).toBe(1)
    advance(4200)
    expect(onComplete).toHaveBeenCalledOnce()
    expect(onProgress).toHaveBeenLastCalledWith(1)
    expect(vi.getTimerCount()).toBe(0)
  })
  it('pauses frame updates while hidden and resumes against the original deadline', () => {
    const visibility = vi
      .spyOn(document, 'visibilityState', 'get')
      .mockReturnValue('visible')
    const onComplete = vi.fn()
    render(<CountdownHarness onComplete={onComplete} />)
    advance(1000)
    visibility.mockReturnValue('hidden')
    act(() => document.dispatchEvent(new Event('visibilitychange')))
    const progress = screen.getByTestId('progress').textContent
    expect(vi.getTimerCount()).toBe(1)
    advance(2000)
    expect(screen.getByTestId('progress').textContent).toBe(progress)
    visibility.mockReturnValue('visible')
    act(() => document.dispatchEvent(new Event('visibilitychange')))
    expect(Number(screen.getByTestId('progress').textContent)).toBeCloseTo(0.6)
    advance(2000)
    expect(onComplete).toHaveBeenCalledOnce()
    expect(vi.getTimerCount()).toBe(0)
  })
  beforeEach(() => {
    // Fake performance together with timers so elapsed time is monotonic and deterministic.
    vi.useFakeTimers({
      toFake: [
        'setTimeout',
        'clearTimeout',
        'requestAnimationFrame',
        'cancelAnimationFrame',
        'performance',
      ],
    })
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('waits the full 5,000 ms and completes exactly once under React StrictMode', () => {
    const onComplete = vi.fn()
    render(
      <StrictMode>
        <CountdownHarness onComplete={onComplete} />
      </StrictMode>,
    )

    expect(screen.getByTestId('seconds').textContent).toBe('5')
    expect(screen.getByTestId('progress').textContent).toBe('0')
    advance(INTRO_DURATION_MS - 1)
    expect(onComplete).not.toHaveBeenCalled()
    expect(screen.getByTestId('seconds').textContent).toBe('1')
    expect(Number(screen.getByTestId('progress').textContent)).toBeLessThan(1)

    advance(1)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('seconds').textContent).toBe('0')
    expect(screen.getByTestId('progress').textContent).toBe('1')
    advance(20_000)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('cleans up pending timers and visibility listeners when unmounted', () => {
    const onComplete = vi.fn()
    const addListener = vi.spyOn(document, 'addEventListener')
    const removeListener = vi.spyOn(document, 'removeEventListener')
    const view = render(
      <StrictMode>
        <CountdownHarness onComplete={onComplete} />
      </StrictMode>,
    )
    advance(1_200)
    view.unmount()

    expect(vi.getTimerCount()).toBe(0)
    const visibilitySubscriptions = addListener.mock.calls.filter(
      ([event]) => event === 'visibilitychange',
    )
    expect(visibilitySubscriptions.length).toBeGreaterThan(0)
    for (const [, listener] of visibilitySubscriptions) {
      expect(removeListener).toHaveBeenCalledWith('visibilitychange', listener)
    }
    advance(10_000)
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('starts a new five-second countdown on a fresh page mount', () => {
    const firstComplete = vi.fn()
    const firstView = render(<CountdownHarness onComplete={firstComplete} />)
    advance(INTRO_DURATION_MS)
    expect(firstComplete).toHaveBeenCalledOnce()
    firstView.unmount()

    const nextComplete = vi.fn()
    render(<CountdownHarness onComplete={nextComplete} />)
    expect(screen.getByTestId('seconds').textContent).toBe('5')
    advance(INTRO_DURATION_MS - 1)
    expect(nextComplete).not.toHaveBeenCalled()
    advance(1)
    expect(nextComplete).toHaveBeenCalledOnce()
  })

  it('uses the latest completion callback without restarting the deadline', () => {
    const oldCallback = vi.fn()
    const newCallback = vi.fn()
    const view = render(<CountdownHarness onComplete={oldCallback} />)
    advance(2_000)
    view.rerender(<CountdownHarness onComplete={newCallback} />)
    advance(3_000)

    expect(oldCallback).not.toHaveBeenCalled()
    expect(newCallback).toHaveBeenCalledOnce()
    expect(screen.getByTestId('seconds').textContent).toBe('0')
  })

  it('observes the elapsed deadline immediately when a throttled background tab becomes visible', () => {
    const onComplete = vi.fn()
    render(<CountdownHarness onComplete={onComplete} />)
    // Advance only the observed clock: neither rAF nor timeouts execute in this simulation.
    const now = performance.now()
    vi.spyOn(performance, 'now').mockReturnValue(now + 7_000)
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible')
    expect(onComplete).not.toHaveBeenCalled()
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })

    expect(onComplete).toHaveBeenCalledOnce()
    expect(screen.getByTestId('seconds').textContent).toBe('0')
    expect(screen.getByTestId('progress').textContent).toBe('1')
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })
    expect(onComplete).toHaveBeenCalledOnce()
    expect(vi.getTimerCount()).toBe(0)
  })
})
