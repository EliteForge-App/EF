import { useEffect } from "react"
import { Pressable } from "react-native"
import Animated from "react-native-reanimated"
import { Text, XStack, YStack } from "tamagui"

import { shuttlesToBeepLevel } from "@/data/beepTestProtocol"
import { useInteractiveMotion } from "@/hooks/useInteractiveMotion"
import { translate } from "@/i18n/translate"
import { eliteForgeColors } from "@/theme/eliteForgeColors"

import { useBeepTestRunner } from "../../hooks/useBeepTestRunner"

export interface TestBeepRunnerPanelProps {
  onMeasured: (level: number, isComplete: boolean) => void
}

function formatCountdown(ms: number): string {
  const seconds = Math.ceil(ms / 1000)
  return `${seconds}s`
}

export function TestBeepRunnerPanel({ onMeasured }: TestBeepRunnerPanelProps) {
  const runner = useBeepTestRunner()
  const startMotion = useInteractiveMotion("button")
  const shuttleMotion = useInteractiveMotion("button")
  const finishMotion = useInteractiveMotion("button")

  const isComplete = runner.status === "finished" && runner.completedShuttles > 0
  const level = shuttlesToBeepLevel(runner.completedShuttles)

  useEffect(() => {
    if (runner.status === "finished") {
      onMeasured(level, runner.completedShuttles > 0)
    } else {
      onMeasured(level, false)
    }
  }, [level, onMeasured, runner.completedShuttles, runner.status])

  return (
    <YStack gap={16}>
      <YStack
        padding={16}
        borderRadius={14}
        backgroundColor="rgba(0,0,0,0.25)"
        borderWidth={1}
        borderColor={
          runner.status === "running" ? eliteForgeColors.emerald : eliteForgeColors.carbonBorder
        }
        gap={10}
        alignItems="center"
      >
        <Text color="rgba(255,255,255,0.55)" fontSize={12} fontWeight="700">
          {translate("profileScreen:measureBeepLevel")}
        </Text>
        <Text color={eliteForgeColors.white} fontWeight="800" fontSize={40}>
          {level > 0 ? level.toFixed(1) : "—"}
        </Text>
        <XStack gap={16}>
          <YStack alignItems="center">
            <Text color="rgba(255,255,255,0.45)" fontSize={10}>
              {translate("profileScreen:measureShuttles")}
            </Text>
            <Text color={eliteForgeColors.emerald} fontWeight="800" fontSize={18}>
              {runner.completedShuttles}
            </Text>
          </YStack>
          {runner.status === "running" && (
            <YStack alignItems="center">
              <Text color="rgba(255,255,255,0.45)" fontSize={10}>
                {translate("profileScreen:measureCountdown")}
              </Text>
              <Text color={eliteForgeColors.orange} fontWeight="800" fontSize={18}>
                {formatCountdown(runner.remainingMs)}
              </Text>
            </YStack>
          )}
        </XStack>
      </YStack>

      {runner.status === "idle" && (
        <Pressable
          onPress={runner.start}
          onPressIn={startMotion.onPressIn}
          onPressOut={startMotion.onPressOut}
        >
          <Animated.View style={startMotion.animatedStyle}>
            <XStack
              paddingVertical={14}
              borderRadius={12}
              backgroundColor="rgba(0,206,200,0.18)"
              borderWidth={1}
              borderColor={eliteForgeColors.emerald}
              alignItems="center"
              justifyContent="center"
            >
              <Text color={eliteForgeColors.emerald} fontWeight="800" fontSize={14}>
                {translate("profileScreen:measureStartBeep")}
              </Text>
            </XStack>
          </Animated.View>
        </Pressable>
      )}

      {runner.status === "running" && (
        <XStack gap={10}>
          <Pressable
            style={{ flex: 1 }}
            onPress={runner.completeShuttle}
            onPressIn={shuttleMotion.onPressIn}
            onPressOut={shuttleMotion.onPressOut}
          >
            <Animated.View style={shuttleMotion.animatedStyle}>
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
                <Text
                  color={eliteForgeColors.emerald}
                  fontWeight="800"
                  fontSize={13}
                  textAlign="center"
                >
                  {translate("profileScreen:measureShuttleDone")}
                </Text>
              </XStack>
            </Animated.View>
          </Pressable>

          <Pressable
            style={{ flex: 1 }}
            onPress={runner.finish}
            onPressIn={finishMotion.onPressIn}
            onPressOut={finishMotion.onPressOut}
          >
            <Animated.View style={finishMotion.animatedStyle}>
              <XStack
                flex={1}
                paddingVertical={14}
                borderRadius={12}
                backgroundColor="rgba(255,140,0,0.14)"
                borderWidth={1}
                borderColor={eliteForgeColors.orange}
                alignItems="center"
                justifyContent="center"
              >
                <Text
                  color={eliteForgeColors.orange}
                  fontWeight="800"
                  fontSize={13}
                  textAlign="center"
                >
                  {translate("profileScreen:measureFinishBeep")}
                </Text>
              </XStack>
            </Animated.View>
          </Pressable>
        </XStack>
      )}

      {isComplete && (
        <Pressable onPress={runner.reset}>
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

      <Text color="rgba(255,255,255,0.4)" fontSize={11} lineHeight={16}>
        {translate("profileScreen:measureBeepHint")}
      </Text>
    </YStack>
  )
}
