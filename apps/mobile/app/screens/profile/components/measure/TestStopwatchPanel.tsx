import { Pressable } from "react-native"
import Animated from "react-native-reanimated"
import { Text, XStack, YStack } from "tamagui"

import { useInteractiveMotion } from "@/hooks/useInteractiveMotion"
import { translate } from "@/i18n/translate"
import { eliteForgeColors } from "@/theme/eliteForgeColors"

import { formatStopwatch, useStopwatch } from "../../hooks/useStopwatch"

export interface TestStopwatchPanelProps {
  onMeasured: (timeSeconds: number, isComplete: boolean) => void
}

export function TestStopwatchPanel({ onMeasured }: TestStopwatchPanelProps) {
  const stopwatch = useStopwatch()
  const startMotion = useInteractiveMotion("button")
  const stopMotion = useInteractiveMotion("button")
  const resetMotion = useInteractiveMotion("button")

  const handleStart = () => {
    stopwatch.start()
    onMeasured(stopwatch.elapsedSeconds, false)
  }

  const handleStop = () => {
    const finalMs = stopwatch.stop()
    const seconds = finalMs / 1000
    if (seconds > 0 && seconds <= 120) {
      onMeasured(seconds, true)
    }
  }

  const handleReset = () => {
    stopwatch.reset()
    onMeasured(0, false)
  }

  return (
    <YStack gap={16} alignItems="center">
      <YStack
        width="100%"
        paddingVertical={28}
        borderRadius={16}
        backgroundColor="rgba(0,0,0,0.28)"
        borderWidth={1}
        borderColor={
          stopwatch.status === "running" ? eliteForgeColors.emerald : eliteForgeColors.carbonBorder
        }
        alignItems="center"
        gap={8}
      >
        <Text color="rgba(255,255,255,0.5)" fontSize={11} fontWeight="700">
          {stopwatch.status === "running"
            ? translate("profileScreen:measureTimerRunning")
            : stopwatch.status === "stopped"
              ? translate("profileScreen:measureTimerDone")
              : translate("profileScreen:measureTimerReady")}
        </Text>
        <Text
          color={eliteForgeColors.white}
          fontWeight="800"
          fontSize={48}
          fontVariant={["tabular-nums"]}
        >
          {formatStopwatch(stopwatch.elapsedMs)}
        </Text>
      </YStack>

      <XStack gap={10} width="100%">
        {stopwatch.status !== "running" && stopwatch.status !== "stopped" && (
          <Pressable
            style={{ flex: 1 }}
            onPress={handleStart}
            onPressIn={startMotion.onPressIn}
            onPressOut={startMotion.onPressOut}
          >
            <Animated.View style={startMotion.animatedStyle}>
              <XStack
                flex={1}
                paddingVertical={14}
                borderRadius={12}
                backgroundColor="rgba(0,206,200,0.18)"
                borderWidth={1}
                borderColor={eliteForgeColors.emerald}
                alignItems="center"
                justifyContent="center"
              >
                <Text color={eliteForgeColors.emerald} fontWeight="800" fontSize={14}>
                  {translate("profileScreen:measureStartTimer")}
                </Text>
              </XStack>
            </Animated.View>
          </Pressable>
        )}

        {stopwatch.status === "running" && (
          <Pressable
            style={{ flex: 1 }}
            onPress={handleStop}
            onPressIn={stopMotion.onPressIn}
            onPressOut={stopMotion.onPressOut}
          >
            <Animated.View style={stopMotion.animatedStyle}>
              <XStack
                flex={1}
                paddingVertical={14}
                borderRadius={12}
                backgroundColor="rgba(255,140,0,0.16)"
                borderWidth={1}
                borderColor={eliteForgeColors.orange}
                alignItems="center"
                justifyContent="center"
              >
                <Text color={eliteForgeColors.orange} fontWeight="800" fontSize={14}>
                  {translate("profileScreen:measureStopTimer")}
                </Text>
              </XStack>
            </Animated.View>
          </Pressable>
        )}

        {stopwatch.status === "stopped" && (
          <Pressable
            style={{ flex: 1 }}
            onPress={handleReset}
            onPressIn={resetMotion.onPressIn}
            onPressOut={resetMotion.onPressOut}
          >
            <Animated.View style={resetMotion.animatedStyle}>
              <XStack
                flex={1}
                paddingVertical={14}
                borderRadius={12}
                backgroundColor="rgba(255,255,255,0.06)"
                borderWidth={1}
                borderColor={eliteForgeColors.carbonBorder}
                alignItems="center"
                justifyContent="center"
              >
                <Text color="rgba(255,255,255,0.7)" fontWeight="800" fontSize={14}>
                  {translate("profileScreen:measureResetTimer")}
                </Text>
              </XStack>
            </Animated.View>
          </Pressable>
        )}
      </XStack>
    </YStack>
  )
}
