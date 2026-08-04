import { useEffect, useState } from "react"
import { Pressable } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Animated from "react-native-reanimated"
import { Text, XStack, YStack } from "tamagui"

import { useInteractiveMotion } from "@/hooks/useInteractiveMotion"
import { translate } from "@/i18n/translate"
import { eliteForgeColors } from "@/theme/eliteForgeColors"

const TOTAL_PASSES = 16

export interface TestPassCounterPanelProps {
  onMeasured: (successful: number, total: number, isComplete: boolean) => void
}

export function TestPassCounterPanel({ onMeasured }: TestPassCounterPanelProps) {
  const [successful, setSuccessful] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const hitMotion = useInteractiveMotion("button")
  const missMotion = useInteractiveMotion("button")

  const isComplete = attempts >= TOTAL_PASSES
  const currentPass = Math.min(attempts + 1, TOTAL_PASSES)

  useEffect(() => {
    onMeasured(successful, attempts, isComplete)
  }, [attempts, isComplete, onMeasured, successful])

  const registerPass = (isHit: boolean) => {
    if (attempts >= TOTAL_PASSES) return
    setAttempts((value) => value + 1)
    if (isHit) setSuccessful((value) => value + 1)
  }

  const reset = () => {
    setSuccessful(0)
    setAttempts(0)
    onMeasured(0, 0, false)
  }

  return (
    <YStack gap={16}>
      <YStack alignItems="center" gap={8}>
        <Text color="rgba(255,255,255,0.55)" fontSize={12} fontWeight="700">
          {translate("profileScreen:measurePassOf", { current: currentPass, total: TOTAL_PASSES })}
        </Text>
        <Text color={eliteForgeColors.white} fontWeight="800" fontSize={42}>
          {successful}/{attempts}
        </Text>
        <Text color={eliteForgeColors.emerald} fontSize={13} fontWeight="700">
          {translate("profileScreen:measurePassesLabel")}
        </Text>
      </YStack>

      {!isComplete ? (
        <XStack gap={10}>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => registerPass(true)}
            onPressIn={hitMotion.onPressIn}
            onPressOut={hitMotion.onPressOut}
          >
            <Animated.View style={hitMotion.animatedStyle}>
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
                  {translate("profileScreen:measurePassHit")}
                </Text>
              </YStack>
            </Animated.View>
          </Pressable>

          <Pressable
            style={{ flex: 1 }}
            onPress={() => registerPass(false)}
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
                  {translate("profileScreen:measurePassMiss")}
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
