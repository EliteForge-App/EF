import type { PlayerPositionId } from "@/data/suggestPlayerPosition"
import { load, remove, save } from "@/utils/storage"

export interface PlayerProfileData {
  displayName: string
  nickname: string
  email: string
  age: string
  bio: string
  avatarUri: string | null
  favoritePositionId: PlayerPositionId | null
}

export interface PsychTestResult {
  completedAt: string
  teamworkScore: number
  onFieldScore: number
  overallScore: number
  answers: number[]
  traits?: Record<string, number>
}

export interface PlayerProfileSnapshot {
  profile: PlayerProfileData
  psychTest?: PsychTestResult
}

const STORAGE_PREFIX = "playerProfile.v1"

function getStorageKey(userKey: string): string {
  return `${STORAGE_PREFIX}.${userKey}`
}

export function createDefaultProfile(authEmail?: string): PlayerProfileData {
  const local = authEmail?.split("@")[0] ?? ""
  return {
    displayName: local ? local.charAt(0).toUpperCase() + local.slice(1) : "",
    nickname: "",
    email: authEmail ?? "",
    age: "",
    bio: "",
    avatarUri: null,
    favoritePositionId: null,
  }
}

export function loadPlayerProfile(userKey: string): PlayerProfileSnapshot | null {
  return load<PlayerProfileSnapshot>(getStorageKey(userKey))
}

export function savePlayerProfile(userKey: string, snapshot: PlayerProfileSnapshot): boolean {
  return save(getStorageKey(userKey), snapshot)
}

export function clearPlayerProfile(userKey: string): void {
  remove(getStorageKey(userKey))
}
