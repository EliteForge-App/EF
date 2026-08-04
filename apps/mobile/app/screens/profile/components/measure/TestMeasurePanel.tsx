import { useCallback } from "react"

import type { PhysicalTestId, TestRawResult } from "@/data/mockPlayerProfile"

import { TestBeepRunnerPanel } from "./TestBeepRunnerPanel"
import { TestDefenseRubricPanel } from "./TestDefenseRubricPanel"
import { TestPassCounterPanel } from "./TestPassCounterPanel"
import { TestShotCounterPanel } from "./TestShotCounterPanel"
import { TestStopwatchPanel } from "./TestStopwatchPanel"

export interface TestMeasurePanelProps {
  testId: PhysicalTestId
  onMeasurementChange: (result: TestRawResult | null, isComplete: boolean) => void
}

export function TestMeasurePanel({ testId, onMeasurementChange }: TestMeasurePanelProps) {
  const handleStopwatch = useCallback(
    (timeSeconds: number, isComplete: boolean) => {
      if (timeSeconds <= 0) {
        onMeasurementChange(null, false)
        return
      }
      const result: TestRawResult =
        testId === "sprint30m"
          ? { type: "sprint30m", timeSeconds }
          : { type: "illinoisAgility", timeSeconds }
      onMeasurementChange(result, isComplete)
    },
    [onMeasurementChange, testId],
  )

  const handleShots = useCallback(
    (goals: number, attempts: number, isComplete: boolean) => {
      if (attempts <= 0) {
        onMeasurementChange(null, false)
        return
      }
      onMeasurementChange({ type: "attackShots16m", goals, attempts: attempts || 10 }, isComplete)
    },
    [onMeasurementChange],
  )

  const handlePasses = useCallback(
    (successful: number, total: number, isComplete: boolean) => {
      if (total <= 0) {
        onMeasurementChange(null, false)
        return
      }
      onMeasurementChange(
        { type: "loughboroughPass", successfulPasses: successful, totalPasses: total || 16 },
        isComplete,
      )
    },
    [onMeasurementChange],
  )

  const handleBeep = useCallback(
    (level: number, isComplete: boolean) => {
      if (level <= 0) {
        onMeasurementChange(null, false)
        return
      }
      onMeasurementChange({ type: "beepTest", level }, isComplete)
    },
    [onMeasurementChange],
  )

  const handleDefense = useCallback(
    (score: number, isComplete: boolean) => {
      onMeasurementChange({ type: "defenseControl", score }, isComplete)
    },
    [onMeasurementChange],
  )

  switch (testId) {
    case "sprint30m":
    case "illinoisAgility":
      return <TestStopwatchPanel onMeasured={handleStopwatch} />
    case "attackShots16m":
      return <TestShotCounterPanel onMeasured={handleShots} />
    case "loughboroughPass":
      return <TestPassCounterPanel onMeasured={handlePasses} />
    case "beepTest":
      return <TestBeepRunnerPanel onMeasured={handleBeep} />
    case "defenseControl":
      return <TestDefenseRubricPanel onMeasured={handleDefense} />
    default:
      return null
  }
}
