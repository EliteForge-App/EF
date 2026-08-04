/** Shuttles per level in the standard multi-stage fitness test (levels 1–21). */
const SHUTTLES_PER_LEVEL = [
  7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17,
]

export function shuttlesToBeepLevel(completedShuttles: number): number {
  if (completedShuttles <= 0) return 0

  let cumulative = 0
  for (let index = 0; index < SHUTTLES_PER_LEVEL.length; index++) {
    const shuttlesInLevel = SHUTTLES_PER_LEVEL[index]!
    const levelStart = cumulative
    cumulative += shuttlesInLevel

    if (completedShuttles <= cumulative) {
      const shuttlesInCurrentLevel = completedShuttles - levelStart
      return index + 1 + shuttlesInCurrentLevel / shuttlesInLevel
    }
  }

  return SHUTTLES_PER_LEVEL.length + 0.99
}

export function getShuttleSpeedKmh(level: number): number {
  return 8.0 + (level - 1) * 0.5
}

/** One-way 20 m shuttle duration in seconds at a given level. */
export function getShuttleDurationSeconds(level: number): number {
  const speedMs = (getShuttleSpeedKmh(level) * 1000) / 3600
  return 20 / speedMs
}

export function getLevelForShuttleIndex(completedShuttles: number): number {
  if (completedShuttles <= 0) return 1
  let cumulative = 0
  for (let index = 0; index < SHUTTLES_PER_LEVEL.length; index++) {
    cumulative += SHUTTLES_PER_LEVEL[index]!
    if (completedShuttles <= cumulative) return index + 1
  }
  return SHUTTLES_PER_LEVEL.length
}
