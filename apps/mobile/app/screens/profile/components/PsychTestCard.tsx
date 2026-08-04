import { Pressable } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Animated from "react-native-reanimated"
import { Text, XStack, YStack } from "tamagui"

import type { PsychTestResult } from "@/utils/playerProfileStorage"
import { useInteractiveMotion } from "@/hooks/useInteractiveMotion"
import { translate } from "@/i18n/translate"
import { eliteForgeColors } from "@/theme/eliteForgeColors"

import { PsychScoresChart } from "./PsychScoresChart"

export interface PsychTestCardProps {
  result?: PsychTestResult
  onStart: () => void
}

export function PsychTestCard({ result, onStart }: PsychTestCardProps) {
  const motion = useInteractiveMotion("button")
  const hasResult = Boolean(result)

  return (
    <YStack
      borderRadius={14}
      borderWidth={1}
      borderColor={eliteForgeColors.carbonBorder}
      backgroundColor={eliteForgeColors.carbonInput}
      padding={14}
      gap={12}
    >
      <XStack alignItems="flex-start" gap={12}>
        <XStack
          width={42}
          height={42}
          borderRadius={12}
          backgroundColor="rgba(123,104,238,0.16)"
          alignItems="center"
          justifyContent="center"
        >
          <Ionicons name="people-outline" size={22} color="#7B68EE" />
        </XStack>
        <YStack flex={1} gap={4}>
          <Text color={eliteForgeColors.white} fontWeight="700" fontSize={15}>
            {translate("profileScreen:psychTestTitle")}
          </Text>
          <Text color="rgba(255,255,255,0.55)" fontSize={12} lineHeight={18}>
            {translate("profileScreen:psychTestCardDesc")}
          </Text>
          {hasResult && result && (
            <PsychScoresChart
              teamworkScore={result.teamworkScore}
              mindsetScore={result.onFieldScore}
              overallScore={result.overallScore}
              compact
            />
          )}
        </YStack>
      </XStack>

      <Pressable onPress={onStart} onPressIn={motion.onPressIn} onPressOut={motion.onPressOut}>
        <Animated.View style={motion.animatedStyle}>
          <XStack
            borderRadius={12}
            paddingVertical={12}
            alignItems="center"
            justifyContent="center"
            backgroundColor="rgba(123,104,238,0.14)"
            borderWidth={1}
            borderColor="rgba(123,104,238,0.45)"
          >
            <Text color="#7B68EE" fontWeight="800" fontSize={13}>
              {hasResult
                ? translate("profileScreen:psychViewOrRetake")
                : translate("profileScreen:psychStart")}
            </Text>
          </XStack>
        </Animated.View>
      </Pressable>
    </YStack>
  )
}
