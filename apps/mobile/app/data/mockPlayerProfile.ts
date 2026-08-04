export type StatKey = "attack" | "defense" | "endurance" | "speed" | "passes" | "dribbling"

export type PlayerStats = Record<StatKey, number>

export type PhysicalTestId =
  | "attackShots16m"
  | "defenseControl"
  | "beepTest"
  | "sprint30m"
  | "loughboroughPass"
  | "illinoisAgility"

export type TestInputType = "goals" | "score" | "beepLevel" | "timeSeconds" | "passAccuracy"

export interface PhysicalTestDefinition {
  id: PhysicalTestId
  statKey: StatKey
  titleKey: string
  descriptionKey: string
  protocolKey: string
  inputType: TestInputType
  inputLabelKey: string
  inputHintKey: string
  unitKey: string
}

export interface Sprint30mResult {
  type: "sprint30m"
  timeSeconds: number
}

export interface IllinoisAgilityResult {
  type: "illinoisAgility"
  timeSeconds: number
}

export interface LoughboroughPassResult {
  type: "loughboroughPass"
  successfulPasses: number
  totalPasses: number
}

export interface DefenseControlResult {
  type: "defenseControl"
  score: number
}

export interface AttackShotsResult {
  type: "attackShots16m"
  goals: number
  attempts: number
}

export interface BeepTestResult {
  type: "beepTest"
  level: number
}

export type TestRawResult =
  | Sprint30mResult
  | IllinoisAgilityResult
  | LoughboroughPassResult
  | DefenseControlResult
  | AttackShotsResult
  | BeepTestResult

export interface PhysicalTestState {
  id: PhysicalTestId
  lastCompletedAt?: string
  rawResult?: TestRawResult
  score?: number
}

export const STAT_ORDER: StatKey[] = [
  "attack",
  "defense",
  "endurance",
  "speed",
  "passes",
  "dribbling",
]

export const STAT_TO_TEST: Record<StatKey, PhysicalTestId> = {
  attack: "attackShots16m",
  defense: "defenseControl",
  endurance: "beepTest",
  speed: "sprint30m",
  passes: "loughboroughPass",
  dribbling: "illinoisAgility",
}

export const PHYSICAL_TEST_DEFINITIONS: PhysicalTestDefinition[] = [
  {
    id: "attackShots16m",
    statKey: "attack",
    titleKey: "profileScreen:testAttackShots",
    descriptionKey: "profileScreen:testAttackShotsDesc",
    protocolKey: "profileScreen:testAttackShotsProtocol",
    inputType: "goals",
    inputLabelKey: "profileScreen:inputGoals",
    inputHintKey: "profileScreen:inputGoalsHint",
    unitKey: "profileScreen:unitGoals",
  },
  {
    id: "defenseControl",
    statKey: "defense",
    titleKey: "profileScreen:testDefenseControl",
    descriptionKey: "profileScreen:testDefenseControlDesc",
    protocolKey: "profileScreen:testDefenseControlProtocol",
    inputType: "score",
    inputLabelKey: "profileScreen:inputDefenseScore",
    inputHintKey: "profileScreen:inputDefenseScoreHint",
    unitKey: "profileScreen:unitPoints",
  },
  {
    id: "beepTest",
    statKey: "endurance",
    titleKey: "profileScreen:testBeep",
    descriptionKey: "profileScreen:testBeepDesc",
    protocolKey: "profileScreen:testBeepProtocol",
    inputType: "beepLevel",
    inputLabelKey: "profileScreen:inputBeepLevel",
    inputHintKey: "profileScreen:inputBeepLevelHint",
    unitKey: "profileScreen:unitLevel",
  },
  {
    id: "sprint30m",
    statKey: "speed",
    titleKey: "profileScreen:testSprint",
    descriptionKey: "profileScreen:testSprintDesc",
    protocolKey: "profileScreen:testSprintProtocol",
    inputType: "timeSeconds",
    inputLabelKey: "profileScreen:inputSprintTime",
    inputHintKey: "profileScreen:inputSprintTimeHint",
    unitKey: "profileScreen:unitSeconds",
  },
  {
    id: "loughboroughPass",
    statKey: "passes",
    titleKey: "profileScreen:testLoughborough",
    descriptionKey: "profileScreen:testLoughboroughDesc",
    protocolKey: "profileScreen:testLoughboroughProtocol",
    inputType: "passAccuracy",
    inputLabelKey: "profileScreen:inputPassAccuracy",
    inputHintKey: "profileScreen:inputPassAccuracyHint",
    unitKey: "profileScreen:unitPercent",
  },
  {
    id: "illinoisAgility",
    statKey: "dribbling",
    titleKey: "profileScreen:testIllinois",
    descriptionKey: "profileScreen:testIllinoisDesc",
    protocolKey: "profileScreen:testIllinoisProtocol",
    inputType: "timeSeconds",
    inputLabelKey: "profileScreen:inputAgilityTime",
    inputHintKey: "profileScreen:inputAgilityTimeHint",
    unitKey: "profileScreen:unitSeconds",
  },
]

export const INITIAL_PLAYER_STATS: PlayerStats = {
  attack: 0,
  defense: 0,
  endurance: 0,
  speed: 0,
  passes: 0,
  dribbling: 0,
}

export function createInitialPhysicalTests(): PhysicalTestState[] {
  return PHYSICAL_TEST_DEFINITIONS.map((test) => ({
    id: test.id,
  }))
}

export function clampStat(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)))
}

export function getTestDefinition(testId: PhysicalTestId): PhysicalTestDefinition | undefined {
  return PHYSICAL_TEST_DEFINITIONS.find((item) => item.id === testId)
}

export function getTestDefinitionByStat(statKey: StatKey): PhysicalTestDefinition {
  const testId = STAT_TO_TEST[statKey]
  return getTestDefinition(testId)!
}

export function isTestLockedThisMonth(lastCompletedAt?: string): boolean {
  if (!lastCompletedAt) return false
  const completed = new Date(lastCompletedAt)
  const now = new Date()
  return completed.getFullYear() === now.getFullYear() && completed.getMonth() === now.getMonth()
}

export function getTestAvailability(state: PhysicalTestState): "available" | "completed" {
  return isTestLockedThisMonth(state.lastCompletedAt) ? "completed" : "available"
}

export function getNextRetakeDate(lastCompletedAt?: string): Date | null {
  if (!lastCompletedAt) return null
  const completed = new Date(lastCompletedAt)
  return new Date(completed.getFullYear(), completed.getMonth() + 1, 1)
}

export function applyTestResult(
  stats: PlayerStats,
  definition: PhysicalTestDefinition,
  score: number,
): PlayerStats {
  return {
    ...stats,
    [definition.statKey]: clampStat(score),
  }
}

export function rebuildStatsFromTests(tests: PhysicalTestState[]): PlayerStats {
  const stats = { ...INITIAL_PLAYER_STATS }
  for (const test of tests) {
    if (test.score == null) continue
    const definition = getTestDefinition(test.id)
    if (!definition) continue
    stats[definition.statKey] = clampStat(test.score)
  }
  return stats
}

export function getTagIdFromEmail(email?: string): string {
  if (!email) return "EF-0000"
  const hash = email.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return `EF-${String(hash % 10000).padStart(4, "0")}`
}
