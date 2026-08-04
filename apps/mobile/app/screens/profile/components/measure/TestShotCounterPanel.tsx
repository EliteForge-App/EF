import { useEffect, useState } from "react"
import { Pressable } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Animated from "react-native-reanimated"
import { Text, XStack, YStack } from "tamagui"

import { useInteractiveMotion } from "@/hooks/useInteractiveMotion"
import { translate } from "@/i18n/translate"
import { eliteForgeColors } from "@/theme/eliteForgeColors"

const TOTAL_SHOTS = 10

export interface TestShotCounterPanelProps {
  onMeasured: (goals: number, attempts: number, isComplete: boolean) => void
}

export function TestShotCounterPanel({ onMeasured }: TestShotCounterPanelProps) {
  const [goals, setGoals] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const goalMotion = useInteractiveMotion("button")
  const missMotion = useInteractiveMotion("button")

  const isComplete = attempts >= TOTAL_SHOTS
  const currentShot = Math.min(attempts + 1, TOTAL_SHOTS)

  useEffect(() => {
    onMeasured(goals, attempts, isComplete)
  }, [attempts, goals, isComplete, onMeasured])

  const registerShot = (isGoal: boolean) => {
    if (attempts >= TOTAL_SHOTS) return
    setAttempts((value) => value + 1)
    if (isGoal) setGoals((value) => value + 1)
  }

  const reset = () => {
    setGoals(0)
    setAttempts(0)
    onMeasured(0, 0, false)
  }

  return (
    <YStack gap={16}>
      <YStack alignItems="center" gap={8}>
        <Text color="rgba(255,255,255,0.55)" fontSize={12} fontWeight="700">
          {translate("profileScreen:measureShotOf", { current: currentShot, total: TOTAL_SHOTS })}
        </Text>
        <Text color={eliteForgeColors.white} fontWeight="800" fontSize={42}>
          {goals}/{attempts}
        </Text>
        <Text color={eliteForgeColors.emerald} fontSize={13} fontWeight="700">
          {translate("profileScreen:measureGoalsLabel")}
        </Text>
      </YStack>

      {!isComplete ? (
        <XStack gap={10}>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => registerShot(true)}
            onPressIn={goalMotion.onPressIn}
            onPressOut={goalMotion.onPressOut}
          >
            <Animated.View style={goalMotion.animatedStyle}>
              <YStack
                paddingVertical={20}
                borderRadius={14}
                backgroundColor="rgba(0,206,200,0.16)"
                borderWidth={1}
                borderColor={eliteForgeColors.emerald}
                alignItems="center"
                gap={6}
              >
                <Ionicons name="checkmark-circle" size={28} color={eliteForgeColors.emerald} />
                <Text color={eliteForgeColors.emerald} fontWeight="800" fontSize={14}>
                  {translate("profileScreen:measureTapGoal")}
                </Text>
              </YStack>
            </Animated.View>
          </Pressable>

          <Pressable
            style={{ flex: 1 }}
            onPress={() => registerShot(false)}
            onPressIn={missMotion.onPressIn}
            onPressOut={missMotion.onPressOut}
          >
            <Animated.View style={missMotion.animatedStyle}>
              <YStack
                paddingVertical={20}
                borderRadius={14}
                backgroundColor="rgba(231,76,60,0.12)"
                borderWidth={1}
                borderColor="rgba(231,76,60,0.45)"
                alignItems="center"
                gap={6}
              >
                <Ionicons name="close-circle" size={28} color="#E74C3C" />
                <Text color="#E74C3C" fontWeight="800" fontSize={14}>
                  {translate("profileScreen:measureTapMiss")}
                </Text>
              </YStack>
            </Animated.View>
          </Pressable>
        </XStack>
      ) : (
        <Pressable onPress={reset}>
          <XStack
            paddingVertical={12}
            borderRadius={12}
            backgroundColor="rgba(255,255,255,0.06)"
            borderWidth={1}
            borderColor={eliteForgeColors.carbonBorder}
            alignItems="center"
            justifyContent="center"
          >
            <Text color="rgba(255,255,255,0.65)" fontWeight="700" fontSize={13}>
              {translate("profileScreen:measureResetCounter")}
            </Text>
          </XStack>
        </Pressable>
      )}
    </YStack>
  )
}
