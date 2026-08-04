import { useCallback, useEffect, useRef, useState } from "react"
import { Vibration } from "react-native"

import {
  getLevelForShuttleIndex,
  getShuttleDurationSeconds,
  shuttlesToBeepLevel,
} from "@/data/beepTestProtocol"

export type BeepRunnerStatus = "idle" | "running" | "finished"

export function useBeepTestRunner() {
  const [status, setStatus] = useState<BeepRunnerStatus>("idle")
  const [completedShuttles, setCompletedShuttles] = useState(0)
  const [remainingMs, setRemainingMs] = useState(0)
  const deadlineRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentLevel = getLevelForShuttleIndex(completedShuttles + 1)
  const beepLevel = shuttlesToBeepLevel(completedShuttles)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const scheduleNextShuttle = useCallback(() => {
    const nextLevel = getLevelForShuttleIndex(completedShuttles + 1)
    const durationMs = getShuttleDurationSeconds(nextLevel) * 1000
    deadlineRef.current = Date.now() + durationMs
    setRemainingMs(durationMs)
  }, [completedShuttles])

  const start = useCallback(() => {
    setStatus("running")
    setCompletedShuttles(0)
    scheduleNextShuttle()
  }, [scheduleNextShuttle])

  const completeShuttle = useCallback(() => {
    if (status !== "running") return
    Vibration.vibrate(80)
    setCompletedShuttles((count) => {
      const next = count + 1
      const nextLevel = getLevelForShuttleIndex(next + 1)
      deadlineRef.current = Date.now() + getShuttleDurationSeconds(nextLevel) * 1000
      return next
    })
  }, [status])

  const finish = useCallback(() => {
    clearTimer()
    setStatus("finished")
    Vibration.vibrate([0, 120, 60, 120])
  }, [clearTimer])

  const failShuttle = useCallback(() => {
    clearTimer()
    setStatus("finished")
    Vibration.vibrate([0, 200, 100, 200])
  }, [clearTimer])

  useEffect(() => {
    if (status !== "running") {
      clearTimer()
      return
    }

    scheduleNextShuttle()
    intervalRef.current = setInterval(() => {
      const remaining = Math.max(0, deadlineRef.current - Date.now())
      setRemainingMs(remaining)
      if (remaining <= 0) {
        failShuttle()
      }
    }, 50)

    return clearTimer
  }, [clearTimer, completedShuttles, failShuttle, scheduleNextShuttle, status])

  const reset = useCallback(() => {
    clearTimer()
    setStatus("idle")
    setCompletedShuttles(0)
    setRemainingMs(0)
  }, [clearTimer])

  return {
    status,
    completedShuttles,
    remainingMs,
    currentLevel,
    beepLevel,
    start,
    completeShuttle,
    finish,
    failShuttle,
    reset,
  }
}
