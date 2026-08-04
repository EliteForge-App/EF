import { useCallback, useEffect, useRef, useState } from "react"

export type StopwatchStatus = "idle" | "running" | "stopped"

export function useStopwatch() {
  const [elapsedMs, setElapsedMs] = useState(0)
  const [status, setStatus] = useState<StopwatchStatus>("idle")
  const startTimeRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    clearTimer()
    startTimeRef.current = Date.now() - elapsedMs
    setStatus("running")
    intervalRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current)
    }, 50)
  }, [clearTimer, elapsedMs])

  const stop = useCallback(() => {
    clearTimer()
    const finalMs = Date.now() - startTimeRef.current
    setElapsedMs(finalMs)
    setStatus("stopped")
    return finalMs
  }, [clearTimer])

  const reset = useCallback(() => {
    clearTimer()
    startTimeRef.current = 0
    setElapsedMs(0)
    setStatus("idle")
  }, [clearTimer])

  useEffect(() => clearTimer, [clearTimer])

  return {
    elapsedMs,
    elapsedSeconds: elapsedMs / 1000,
    status,
    start,
    stop,
    reset,
  }
}

export function formatStopwatch(ms: number): string {
  const totalSeconds = ms / 1000
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  const centis = Math.floor((ms % 1000) / 10)
  if (minutes > 0) {
    return `${minutes}:${String(seconds).padStart(2, "0")}.${String(centis).padStart(2, "0")}`
  }
  return `${seconds}.${String(centis).padStart(2, "0")}s`
}
