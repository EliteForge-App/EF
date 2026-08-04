import { useCallback, useEffect, useState } from "react"

import type { PlayerPositionId } from "@/data/suggestPlayerPosition"
import type { PsychTestResult } from "@/utils/playerProfileStorage"
import {
  createDefaultProfile,
  loadPlayerProfile,
  savePlayerProfile,
  type PlayerProfileData,
} from "@/utils/playerProfileStorage"

function mergeProfile(
  stored: PlayerProfileData | undefined,
  authEmail?: string,
): PlayerProfileData {
  const defaults = createDefaultProfile(authEmail)
  if (!stored) return defaults
  return { ...defaults, ...stored }
}

export function usePlayerProfile(userKey: string, authEmail?: string) {
  const [profile, setProfile] = useState<PlayerProfileData>(() => createDefaultProfile(authEmail))
  const [psychTest, setPsychTest] = useState<PsychTestResult | undefined>()
  const [hydrated, setHydrated] = useState(false)

  const reload = useCallback(() => {
    const snapshot = loadPlayerProfile(userKey)
    setProfile(mergeProfile(snapshot?.profile, authEmail))
    setPsychTest(snapshot?.psychTest)
  }, [authEmail, userKey])

  useEffect(() => {
    reload()
    setHydrated(true)
  }, [reload])

  const persist = useCallback(
    (nextProfile: PlayerProfileData, nextPsychTest?: PsychTestResult) => {
      savePlayerProfile(userKey, {
        profile: nextProfile,
        psychTest: nextPsychTest,
      })
    },
    [userKey],
  )

  const updateProfile = useCallback(
    (patch: Partial<PlayerProfileData>) => {
      setProfile((current) => {
        const next = { ...current, ...patch }
        persist(next, psychTest)
        return next
      })
    },
    [persist, psychTest],
  )

  const saveFullProfile = useCallback(
    (nextProfile: PlayerProfileData) => {
      setProfile(nextProfile)
      persist(nextProfile, psychTest)
    },
    [persist, psychTest],
  )

  const setFavoritePosition = useCallback(
    (favoritePositionId: PlayerPositionId | null) => {
      updateProfile({ favoritePositionId })
    },
    [updateProfile],
  )

  const savePsychTestResult = useCallback(
    (result: PsychTestResult) => {
      setPsychTest(result)
      persist(profile, result)
    },
    [persist, profile],
  )

  const resetPsychTest = useCallback(() => {
    setPsychTest(undefined)
    persist(profile, undefined)
  }, [persist, profile])

  return {
    profile,
    psychTest,
    updateProfile,
    saveFullProfile,
    setFavoritePosition,
    savePsychTestResult,
    resetPsychTest,
    reload,
    hydrated,
  }
}
