import type { PhysicalTestState, PlayerStats } from "@/data/mockPlayerProfile"
import { load, remove, save } from "@/utils/storage"
export interface ProfileStatsSnapshot {
  stats: PlayerStats
  tests: PhysicalTestState[]
}

const STORAGE_PREFIX = "profileStats.v2"

function getStorageKey(userKey: string): string {
  return `${STORAGE_PREFIX}.${userKey}`
}

export function loadProfileStats(userKey: string): ProfileStatsSnapshot | null {
  return load<ProfileStatsSnapshot>(getStorageKey(userKey))
}

export function saveProfileStats(userKey: string, snapshot: ProfileStatsSnapshot): boolean {
  return save(getStorageKey(userKey), snapshot)
}

export function clearProfileStats(userKey: string): void {
  remove(getStorageKey(userKey))
}
