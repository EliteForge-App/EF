export type PsychQuestionCategory = "teamwork" | "onField"

export type PsychTraitKey =
  | "organizer"
  | "directness"
  | "discipline"
  | "creativity"
  | "competitiveness"

export const PSYCH_TRAIT_KEYS: PsychTraitKey[] = [
  "organizer",
  "directness",
  "discipline",
  "creativity",
  "competitiveness",
]

export interface PsychQuestion {
  id: string
  category: PsychQuestionCategory
  textKey: string
  /** Invierte la puntuación para el promedio de categoría (teamwork / onField). */
  reverseScored?: boolean
  /** Peso por rasgo; negativo = acuerdo alto reduce ese rasgo. */
  traits: Partial<Record<PsychTraitKey, number>>
}

export const PSYCH_QUESTIONS: PsychQuestion[] = [
  {
    id: "q1",
    category: "teamwork",
    textKey: "profileScreen:psychQ1",
    traits: { organizer: 1, discipline: 0.4, directness: -0.5 },
  },
  {
    id: "q2",
    category: "teamwork",
    textKey: "profileScreen:psychQ2",
    reverseScored: true,
    traits: { organizer: 0.5, competitiveness: -0.3 },
  },
  {
    id: "q3",
    category: "teamwork",
    textKey: "profileScreen:psychQ3",
    traits: { organizer: 1, discipline: 0.8 },
  },
  {
    id: "q4",
    category: "teamwork",
    textKey: "profileScreen:psychQ4",
    traits: { discipline: 1, organizer: 0.4, directness: -0.4 },
  },
  {
    id: "q5",
    category: "teamwork",
    textKey: "profileScreen:psychQ5",
    traits: { discipline: 0.9, organizer: 0.5, creativity: -0.5 },
  },
  {
    id: "q6",
    category: "onField",
    textKey: "profileScreen:psychQ6",
    traits: { directness: 1, competitiveness: 0.7, creativity: 0.3 },
  },
  {
    id: "q7",
    category: "onField",
    textKey: "profileScreen:psychQ7",
    traits: { discipline: 1, organizer: 0.5, creativity: -0.6 },
  },
  {
    id: "q8",
    category: "onField",
    textKey: "profileScreen:psychQ8",
    traits: { discipline: 1, organizer: 0.6, directness: -0.5 },
  },
  {
    id: "q9",
    category: "onField",
    textKey: "profileScreen:psychQ9",
    traits: { directness: 0.9, creativity: 0.8, competitiveness: 0.4 },
  },
  {
    id: "q10",
    category: "onField",
    textKey: "profileScreen:psychQ10",
    traits: { discipline: 1, competitiveness: 0.5, creativity: -0.7 },
  },
]

export const PSYCH_LIKERT_OPTIONS = [
  { value: 1, labelKey: "profileScreen:psychLikert1" },
  { value: 2, labelKey: "profileScreen:psychLikert2" },
  { value: 3, labelKey: "profileScreen:psychLikert3" },
  { value: 4, labelKey: "profileScreen:psychLikert4" },
  { value: 5, labelKey: "profileScreen:psychLikert5" },
] as const

function normalizeAnswer(answer: number, reverse = false): number {
  const clamped = Math.max(1, Math.min(5, answer))
  const norm = (clamped - 1) / 4
  return reverse ? 1 - norm : norm
}

function averageCategoryAnswers(
  questions: PsychQuestion[],
  answers: number[],
  category: PsychQuestionCategory,
): number[] {
  return questions
    .map((question, index) => ({ question, answer: answers[index] ?? 0 }))
    .filter(({ question, answer }) => question.category === category && answer > 0)
    .map(({ question, answer }) => normalizeAnswer(answer, question.reverseScored))
}

export function computePsychTraits(answers: number[]): Record<PsychTraitKey, number> | null {
  if (answers.length !== PSYCH_QUESTIONS.length || answers.some((value) => value <= 0)) {
    return null
  }

  const sums = Object.fromEntries(PSYCH_TRAIT_KEYS.map((key) => [key, 0])) as Record<
    PsychTraitKey,
    number
  >
  const weights = Object.fromEntries(PSYCH_TRAIT_KEYS.map((key) => [key, 0])) as Record<
    PsychTraitKey,
    number
  >

  PSYCH_QUESTIONS.forEach((question, index) => {
    const answer = answers[index] ?? 0
    if (answer <= 0) return

    for (const [trait, weight] of Object.entries(question.traits) as [
      PsychTraitKey,
      number,
    ][]) {
      const reverse = weight < 0
      const contribution = normalizeAnswer(answer, reverse) * Math.abs(weight)
      sums[trait] += contribution
      weights[trait] += Math.abs(weight)
    }
  })

  return Object.fromEntries(
    PSYCH_TRAIT_KEYS.map((key) => [
      key,
      weights[key] > 0 ? Math.round((sums[key] / weights[key]) * 100) : 50,
    ]),
  ) as Record<PsychTraitKey, number>
}

export function scorePsychAnswers(answers: number[]): {
  teamworkScore: number
  onFieldScore: number
  overallScore: number
  traits: Record<PsychTraitKey, number> | null
} {
  const teamworkValues = averageCategoryAnswers(PSYCH_QUESTIONS, answers, "teamwork")
  const onFieldValues = averageCategoryAnswers(PSYCH_QUESTIONS, answers, "onField")

  const avg = (values: number[]) =>
    values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0

  const teamworkScore = Math.round(avg(teamworkValues) * 100)
  const onFieldScore = Math.round(avg(onFieldValues) * 100)
  const overallScore = Math.round((teamworkScore + onFieldScore) / 2)
  const traits = computePsychTraits(answers)

  return { teamworkScore, onFieldScore, overallScore, traits }
}

export function isPsychTestLockedThisMonth(completedAt?: string): boolean {
  if (!completedAt) return false
  const completed = new Date(completedAt)
  const now = new Date()
  return (
    completed.getFullYear() === now.getFullYear() && completed.getMonth() === now.getMonth()
  )
}

export function isPsychAnswersCompatible(answers?: number[]): boolean {
  return Boolean(answers && answers.length === PSYCH_QUESTIONS.length)
}
