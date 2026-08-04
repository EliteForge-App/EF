import { useCallback, useEffect, useMemo, useState } from "react"

import {
  applyTestResult,
  createInitialPhysicalTests,
  getTestAvailability,
  getTestDefinition,
  INITIAL_PLAYER_STATS,
  PHYSICAL_TEST_DEFINITIONS,
  rebuildStatsFromTests,
  STAT_ORDER,
  type PhysicalTestId,
  type PhysicalTestState,
  type PlayerStats,
  type TestRawResult,
} from "@/data/mockPlayerProfile"
import { scoreTestResult } from "@/data/profileTestScoring"
import { computePsychTraits } from "@/data/psychologicalTest"
import { suggestPlayerPosition } from "@/data/suggestPlayerPosition"
import { translate } from "@/i18n/translate"
import { loadProfileStats, saveProfileStats, clearProfileStats } from "@/utils/profileStatsStorage"

function mergeInitialState(stored?: PhysicalTestState[] | null): PhysicalTestState[] {
  const defaults = createInitialPhysicalTests()
  if (!stored?.length) return defaults

  return defaults.map((item) => {
    const saved = stored.find((entry) => entry.id === item.id)
    return saved ? { ...item, ...saved } : item
  })
}

export function useProfileStats(userKey: string, psychAnswers?: number[]) {
  const [stats, setStats] = useState<PlayerStats>(INITIAL_PLAYER_STATS)
  const [tests, setTests] = useState<PhysicalTestState[]>(() => createInitialPhysicalTests())
  const [hydrated, setHydrated] = useState(false)

  const reload = useCallback(() => {
    const snapshot = loadProfileStats(userKey)
    if (!snapshot) {
      setTests(createInitialPhysicalTests())
      setStats(INITIAL_PLAYER_STATS)
      return
    }
    const mergedTests = mergeInitialState(snapshot.tests)
    setTests(mergedTests)
    setStats(rebuildStatsFromTests(mergedTests))
  }, [userKey])

  const resetAllTests = useCallback(() => {
    clearProfileStats(userKey)
    const freshTests = createInitialPhysicalTests()
    setTests(freshTests)
    setStats(INITIAL_PLAYER_STATS)
  }, [userKey])

  useEffect(() => {
    reload()
    setHydrated(true)
  }, [reload])

  const persist = useCallback(
    (nextStats: PlayerStats, nextTests: PhysicalTestState[]) => {
      saveProfileStats(userKey, { stats: nextStats, tests: nextTests })
    },
    [userKey],
  )

  const radarData = useMemo(
    () =>
      STAT_ORDER.map((key) => ({
        key,
        label: translate(`profileScreen:stat_${key}` as never),
        value: stats[key],
        hasResult: stats[key] > 0,
      })),
    [stats],
  )

  const positionSuggestion = useMemo(() => {
    const psychTraits = psychAnswers ? computePsychTraits(psychAnswers) : null
    return suggestPlayerPosition(stats, tests, psychTraits)
  }, [psychAnswers, stats, tests])

  const completeTest = useCallback(
    (testId: PhysicalTestId, rawResult: TestRawResult) => {
      const definition = getTestDefinition(testId)
      if (!definition) return false

      const existing = tests.find((item) => item.id === testId)
      if (existing && getTestAvailability(existing) === "completed") return false

      const score = scoreTestResult(rawResult)
      const nextTests = tests.map((item) =>
        item.id === testId
          ? {
              ...item,
              lastCompletedAt: new Date().toISOString(),
              rawResult,
              score,
            }
          : item,
      )
      const nextStats = applyTestResult(stats, definition, score)

      setTests(nextTests)
      setStats(nextStats)
      persist(nextStats, nextTests)
      return true
    },
    [persist, stats, tests],
  )

  const getTestState = useCallback(
    (testId: PhysicalTestId) => tests.find((item) => item.id === testId),
    [tests],
  )

  return {
    stats,
    tests,
    radarData,
    positionSuggestion,
    completeTest,
    getTestState,
    reload,
    resetAllTests,
    hydrated,
    definitions: PHYSICAL_TEST_DEFINITIONS,
  }
}
