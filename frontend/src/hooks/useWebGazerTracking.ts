import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export interface GazePoint {
  x: number
  y: number
  timestamp: number
}

export interface FixationStats {
  mean_duration: number
  count: number
}

export interface RegressionStats {
  count: number
}

export interface GazeMetrics {
  faceDetected: boolean
  gazeDirection: string   // 'Center' | 'Left' | 'Right' | 'Top' | 'Bottom' | 'Unknown'
  attentionScore: number  // 0-100
  focusSeconds: number
  offScreenCount: number
  blinkCount: number
  eyeContactPct: number   // 0-100
}

interface WebGazerApi {
  setRegression: (type: string) => WebGazerApi
  setGazeListener: (listener: ((data: { x: number; y: number } | null) => void) | null) => WebGazerApi
  begin: () => Promise<unknown>
  clearGazeListener: () => WebGazerApi
  showVideoPreview?: (show: boolean) => WebGazerApi
  showPredictionPoints?: (show: boolean) => WebGazerApi
  showVideo?: (show: boolean) => WebGazerApi
  showFaceOverlay?: (show: boolean) => WebGazerApi
  showFaceFeedbackBox?: (show: boolean) => WebGazerApi
}

declare global {
  interface Window { webgazer?: WebGazerApi }
}

const WEBGAZER_SCRIPT         = 'https://webgazer.cs.brown.edu/webgazer.js'
const FIXATION_RADIUS_PX      = 40
const MIN_FIXATION_MS         = 120
const REGRESSION_THRESHOLD_PX = 20
// If no gaze point arrives for this long, assume face/gaze is lost
const GAZE_LOST_THRESHOLD_MS  = 800
// Blink: gaze disappears then reappears within this window
const BLINK_MAX_GAP_MS        = 350
const BLINK_MIN_GAP_MS        = 50

export function useWebGazerTracking() {
  const [isReady,       setIsReady]       = useState(false)
  const [error,         setError]         = useState<string | null>(null)
  const [gazeStream,    setGazeStream]    = useState<GazePoint[]>([])
  const [fixationStats, setFixationStats] = useState<FixationStats>({ mean_duration: 0, count: 0 })
  const [regressions,   setRegressions]   = useState<RegressionStats>({ count: 0 })
  const [gazeMetrics,   setGazeMetrics]   = useState<GazeMetrics>({
    faceDetected: false,
    gazeDirection: 'Unknown',
    attentionScore: 0,
    focusSeconds: 0,
    offScreenCount: 0,
    blinkCount: 0,
    eyeContactPct: 0,
  })

  const isTrackingRef         = useRef(false)
  const uiCleanupTimerRef     = useRef<ReturnType<typeof setInterval> | null>(null)
  const gazeStreamRef         = useRef<GazePoint[]>([])
  const lastPointRef          = useRef<GazePoint | null>(null)
  const fixationStartRef      = useRef<GazePoint | null>(null)
  const fixationDurationSumRef = useRef(0)
  const fixationCountRef      = useRef(0)
  const regressionCountRef    = useRef(0)

  // Attention / focus tracking
  const trackingStartTimeRef  = useRef<number>(0)
  const focusSecondsRef       = useRef(0)
  const offScreenCountRef     = useRef(0)
  const blinkCountRef         = useRef(0)
  const totalGazeFramesRef    = useRef(0)
  const onScreenFramesRef     = useRef(0)
  const faceDetectedRef       = useRef(false)
  const lastGazeTimeRef       = useRef<number>(0)
  const gazeAbsentSinceRef    = useRef<number | null>(null)  // when gaze was lost
  const blinkGapStartRef      = useRef<number | null>(null)  // for blink detection
  const metricsTimerRef       = useRef<ReturnType<typeof setInterval> | null>(null)

  /* ── Determine gaze direction from screen coordinates ── */
  const getGazeDirection = (x: number, y: number): string => {
    const w = window.innerWidth
    const h = window.innerHeight
    const cx = w / 2
    const cy = h / 2
    const deadZone = 0.2  // 20% dead zone around center
    const nx = (x - cx) / cx  // -1 to 1
    const ny = (y - cy) / cy

    if (Math.abs(nx) < deadZone && Math.abs(ny) < deadZone) return 'Center'
    if (Math.abs(nx) >= Math.abs(ny)) {
      return nx < 0 ? 'Left' : 'Right'
    }
    return ny < 0 ? 'Top' : 'Bottom'
  }

  /* ── Hide WebGazer's own UI elements ── */
  const hideWebGazerUi = useCallback(() => {
    const wg = window.webgazer
    if (wg) {
      wg.showVideoPreview?.(false)
      wg.showPredictionPoints?.(false)
      wg.showVideo?.(false)
      wg.showFaceOverlay?.(false)
      wg.showFaceFeedbackBox?.(false)
    }
    ;['webgazerVideoContainer','webgazerVideoFeed','webgazerFaceOverlay',
      'webgazerFaceFeedbackBox','webgazerGazeDot'].forEach(id => {
      document.getElementById(id)?.remove()
    })
  }, [])

  /* ── Load WebGazer script ── */
  const loadWebGazerScript = useCallback(async () => {
    if (window.webgazer) { setIsReady(true); return }

    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${WEBGAZER_SCRIPT}"]`)
      if (existing) {
        if (window.webgazer) { resolve(); return }
        existing.addEventListener('load', () => resolve(), { once: true })
        existing.addEventListener('error', () => reject(new Error('Failed to load WebGazer script')), { once: true })
        return
      }
      const script = document.createElement('script')
      script.src   = WEBGAZER_SCRIPT
      script.async = true
      script.onload  = () => resolve()
      script.onerror = () => reject(new Error('Failed to load WebGazer script'))
      document.body.appendChild(script)
    })

    if (!window.webgazer) throw new Error('WebGazer not available after script load')
    hideWebGazerUi()
    setIsReady(true)
  }, [hideWebGazerUi])

  useEffect(() => {
    loadWebGazerScript().catch((err: unknown) => {
      setError(err instanceof Error ? err.message : 'Could not initialize WebGazer')
    })
  }, [loadWebGazerScript])

  /* ── Periodic metrics update (every second) ── */
  const updateGazeMetrics = useCallback(() => {
    if (!isTrackingRef.current) return

    const now = Date.now()
    const elapsed = Math.max(1, (now - trackingStartTimeRef.current) / 1000)
    const lastGaze = lastGazeTimeRef.current

    // Face detected = received a gaze point within the last GAZE_LOST_THRESHOLD_MS
    const faceDetected = lastGaze > 0 && (now - lastGaze) < GAZE_LOST_THRESHOLD_MS
    faceDetectedRef.current = faceDetected

    if (faceDetected) {
      focusSecondsRef.current += 1
    }

    // Attention = fraction of elapsed time where gaze was on-screen
    const attentionScore = Math.min(100, Math.round(
      (onScreenFramesRef.current / Math.max(1, totalGazeFramesRef.current)) * 100
    ))

    // Eye contact % = focus time / total elapsed
    const eyeContactPct = Math.min(100, Math.round(
      (focusSecondsRef.current / elapsed) * 100
    ))

    const lastPoint = lastPointRef.current
    const direction = faceDetected && lastPoint
      ? getGazeDirection(lastPoint.x, lastPoint.y)
      : 'Unknown'

    setGazeMetrics({
      faceDetected,
      gazeDirection: direction,
      attentionScore,
      focusSeconds: focusSecondsRef.current,
      offScreenCount: offScreenCountRef.current,
      blinkCount: blinkCountRef.current,
      eyeContactPct,
    })
  }, [])

  /* ── Gaze listener ── */
  const commitFixation = useCallback((durationMs: number) => {
    if (durationMs < MIN_FIXATION_MS) return
    fixationCountRef.current      += 1
    fixationDurationSumRef.current += durationMs
    setFixationStats({
      count:         fixationCountRef.current,
      mean_duration: fixationDurationSumRef.current / fixationCountRef.current,
    })
  }, [])

  const gazeListener = useCallback((data: { x: number; y: number } | null) => {
    if (!isTrackingRef.current) return

    const now = Date.now()
    totalGazeFramesRef.current += 1

    if (!data) {
      // Gaze lost — check if this is a blink
      if (gazeAbsentSinceRef.current === null) {
        gazeAbsentSinceRef.current = now
        blinkGapStartRef.current   = now
      }
      return
    }

    // Gaze returned — check for blink
    if (gazeAbsentSinceRef.current !== null) {
      const gapMs = now - gazeAbsentSinceRef.current

      if (gapMs >= BLINK_MIN_GAP_MS && gapMs <= BLINK_MAX_GAP_MS) {
        // Short disappearance = blink
        blinkCountRef.current += 1
      } else if (gapMs > GAZE_LOST_THRESHOLD_MS) {
        // Long disappearance = off-screen event
        offScreenCountRef.current += 1
      }
      gazeAbsentSinceRef.current = null
      blinkGapStartRef.current   = null
    }

    lastGazeTimeRef.current = now

    // Is gaze on-screen?
    const isOnScreen = data.x >= 0 && data.x <= window.innerWidth &&
                       data.y >= 0 && data.y <= window.innerHeight
    if (isOnScreen) onScreenFramesRef.current += 1

    const point: GazePoint = { x: data.x, y: data.y, timestamp: now }
    const previous = lastPointRef.current

    if (previous) {
      const dx = point.x - previous.x
      const dy = point.y - previous.y

      // Regression
      if (dx < -REGRESSION_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy)) {
        regressionCountRef.current += 1
        setRegressions({ count: regressionCountRef.current })
      }

      // Fixation
      const distance    = Math.hypot(dx, dy)
      const fixStart    = fixationStartRef.current
      if (!fixStart) {
        fixationStartRef.current = previous
      } else if (distance <= FIXATION_RADIUS_PX) {
        const currentDuration = point.timestamp - fixStart.timestamp
        setFixationStats({
          count:
            fixationCountRef.current +
            (currentDuration >= MIN_FIXATION_MS ? 1 : 0),
          mean_duration:
            fixationCountRef.current + (currentDuration >= MIN_FIXATION_MS ? 1 : 0) > 0
              ? (fixationDurationSumRef.current +
                  (currentDuration >= MIN_FIXATION_MS ? currentDuration : 0)) /
                (fixationCountRef.current +
                  (currentDuration >= MIN_FIXATION_MS ? 1 : 0))
              : 0,
        })
      } else {
        commitFixation(previous.timestamp - fixStart.timestamp)
        fixationStartRef.current = point
      }
    } else {
      fixationStartRef.current = point
    }

    lastPointRef.current = point
    gazeStreamRef.current = [...gazeStreamRef.current, point]
    setGazeStream(gazeStreamRef.current)
  }, [commitFixation])

  /* ── Public API ── */

  const resetTracking = useCallback(() => {
    gazeStreamRef.current          = []
    lastPointRef.current           = null
    fixationStartRef.current       = null
    fixationDurationSumRef.current = 0
    fixationCountRef.current       = 0
    regressionCountRef.current     = 0
    focusSecondsRef.current        = 0
    offScreenCountRef.current      = 0
    blinkCountRef.current          = 0
    totalGazeFramesRef.current     = 0
    onScreenFramesRef.current      = 0
    faceDetectedRef.current        = false
    lastGazeTimeRef.current        = 0
    gazeAbsentSinceRef.current     = null
    blinkGapStartRef.current       = null
    trackingStartTimeRef.current   = 0
    setGazeStream([])
    setFixationStats({ mean_duration: 0, count: 0 })
    setRegressions({ count: 0 })
    setGazeMetrics({
      faceDetected: false,
      gazeDirection: 'Unknown',
      attentionScore: 0,
      focusSeconds: 0,
      offScreenCount: 0,
      blinkCount: 0,
      eyeContactPct: 0,
    })
  }, [])

  const startTracking = useCallback(async () => {
    if (!window.webgazer) throw new Error('WebGazer is not loaded')

    resetTracking()
    isTrackingRef.current        = true
    trackingStartTimeRef.current = Date.now()

    await window.webgazer
      .setRegression('ridge')
      .setGazeListener(gazeListener)
      .begin()

    hideWebGazerUi()

    if (uiCleanupTimerRef.current) clearInterval(uiCleanupTimerRef.current)
    uiCleanupTimerRef.current = setInterval(hideWebGazerUi, 500)

    // Update derived metrics every second
    if (metricsTimerRef.current) clearInterval(metricsTimerRef.current)
    metricsTimerRef.current = setInterval(updateGazeMetrics, 1000)
  }, [gazeListener, hideWebGazerUi, resetTracking, updateGazeMetrics])

  const stopTracking = useCallback(() => {
    isTrackingRef.current = false

    // Commit any open fixation
    const fixStart  = fixationStartRef.current
    const lastPoint = lastPointRef.current
    if (fixStart && lastPoint) {
      commitFixation(lastPoint.timestamp - fixStart.timestamp)
    }
    fixationStartRef.current = null

    window.webgazer?.clearGazeListener()

    if (uiCleanupTimerRef.current) {
      clearInterval(uiCleanupTimerRef.current)
      uiCleanupTimerRef.current = null
    }
    if (metricsTimerRef.current) {
      clearInterval(metricsTimerRef.current)
      metricsTimerRef.current = null
    }
  }, [commitFixation])

  const snapshot = useMemo(() => ({
    gaze_stream:    gazeStream,
    fixation_stats: fixationStats,
    regressions,
  }), [gazeStream, fixationStats, regressions])

  return {
    isReady,
    error,
    gazeStream,
    fixationStats,
    regressions,
    gazeMetrics,
    snapshot,
    startTracking,
    stopTracking,
    resetTracking,
  }
}
