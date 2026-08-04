import { useEffect, useMemo, useState } from "react"
import { Pressable } from "react-native"
import { Text, XStack, YStack } from "tamagui"

import { translate } from "@/i18n/translate"
import { eliteForgeColors } from "@/theme/eliteForgeColors"

const CRITERION_KEYS = [
  "profileScreen:defenseCriterion1",
  "profileScreen:defenseCriterion2",
  "profileScreen:defenseCriterion3",
  "profileScreen:defenseCriterion4",
  "profileScreen:defenseCriterion5",
] as const

const MAX_PER_CRITERION = 20

export interface TestDefenseRubricPanelProps {
  onMeasured: (score: number, isComplete: boolean) => void
}

export function TestDefenseRubricPanel({ onMeasured }: TestDefenseRubricPanelProps) {
  const [scores, setScores] = useState<number[]>(() => CRITERION_KEYS.map(() => 10))

  const totalScore = useMemo(() => scores.reduce((sum, value) => sum + value, 0), [scores])
  const isComplete = scores.every((value) => value >= 0)

  useEffect(() => {
    onMeasured(totalScore, isComplete)
  }, [isComplete, onMeasured, totalScore])

  const adjust = (index: number, delta: number) => {
    setScores((current) =>
      current.map((value, itemIndex) => {
        if (itemIndex !== index) return value
        return Math.min(MAX_PER_CRITERION, Math.max(0, value + delta))
      }),
    )
  }

  return (
    <YStack gap={14}>
      <YStack alignItems="center" gap={4}>
        <Text color={eliteForgeColors.white} fontWeight="800" fontSize={36}>
          {totalScore}
        </Text>
        <Text color="rgba(255,255,255,0.55)" fontSize={12}>
          {translate("profileScreen:measureDefenseTotal")}
        </Text>
      </YStack>

      {CRITERION_KEYS.map((key, index) => (
        <YStack
          key={key}
          padding={12}
          borderRadius={12}
          backgroundColor={eliteForgeColors.carbonInput}
          borderWidth={1}
          borderColor={eliteForgeColors.carbonBorder}
          gap={8}
        >
          <XStack alignItems="center" justifyContent="space-between">
            <Text color="rgba(255,255,255,0.75)" fontSize={12} fontWeight="700" flex={1}>
              {translate(key)}
            </Text>
            <Text color={eliteForgeColors.emerald} fontWeight="800" fontSize={16}>
              {scores[index]}
            </Text>
          </XStack>
          <XStack gap={8}>
            <Pressable style={{ flex: 1 }} onPress={() => adjust(index, -1)}>
              <XStack
                paddingVertical={10}
                borderRadius={10}
                backgroundColor="rgba(255,255,255,0.06)"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="rgba(255,255,255,0.7)" fontWeight="800" fontSize={16}>
                  −
                </Text>
              </XStack>
            </Pressable>
            <Pressable style={{ flex: 1 }} onPress={() => adjust(index, 1)}>
              <XStack
                paddingVertical={10}
                borderRadius={10}
                backgroundColor="rgba(0,206,200,0.12)"
                alignItems="center"
                justifyContent="center"
              >
                <Text color={eliteForgeColors.emerald} fontWeight="800" fontSize={16}>
                  +
                </Text>
              </XStack>
            </Pressable>
          </XStack>
        </YStack>
      ))}
    </YStack>
  )
}
