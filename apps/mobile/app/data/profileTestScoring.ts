import { clampStat, type TestRawResult } from "@/data/mockPlayerProfile"

function linearScore(value: number, best: number, worst: number, higherIsBetter: boolean): number {
  if (higherIsBetter) {
    if (value >= best) return 100
    if (value <= worst) return 0
    return ((value - worst) / (best - worst)) * 100
  }
  if (value <= best) return 100
  if (value >= worst) return 0
  return ((worst - value) / (worst - best)) * 100
}

export function scoreTestResult(rawResult: TestRawResult): number {
  switch (rawResult.type) {
    case "sprint30m":
      return clampStat(linearScore(rawResult.timeSeconds, 4.0, 7.0, false))
    case "illinoisAgility":
      return clampStat(linearScore(rawResult.timeSeconds, 14.5, 22.0, false))
    case "loughboroughPass": {
      const accuracy = (rawResult.successfulPasses / rawResult.totalPasses) * 100
      return clampStat(accuracy)
    }
    case "defenseControl":
      return clampStat(rawResult.score)
    case "attackShots16m":
      return clampStat((rawResult.goals / rawResult.attempts) * 100)
    case "beepTest":
      return clampStat(linearScore(rawResult.level, 5.0, 12.5, true))
    default:
      return 0
  }
}

export function formatRawResultSummary(rawResult: TestRawResult): string {
  switch (rawResult.type) {
    case "sprint30m":
      return `${rawResult.timeSeconds.toFixed(2)} s`
    case "illinoisAgility":
      return `${rawResult.timeSeconds.toFixed(2)} s`
    case "loughboroughPass":
      return `${rawResult.successfulPasses}/${rawResult.totalPasses}`
    case "defenseControl":
      return `${rawResult.score}/100`
    case "attackShots16m":
      return `${rawResult.goals}/${rawResult.attempts}`
    case "beepTest":
      return `Level ${rawResult.level.toFixed(1)}`
    default:
      return "—"
  }
}
