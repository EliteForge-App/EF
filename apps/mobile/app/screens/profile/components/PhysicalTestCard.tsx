import { Pressable } from "react-native"

import { Ionicons } from "@expo/vector-icons"

import Animated from "react-native-reanimated"

import { Text, XStack, YStack } from "tamagui"

import {
  getNextRetakeDate,
  getTestAvailability,
  type PhysicalTestDefinition,
  type PhysicalTestState,
} from "@/data/mockPlayerProfile"

import { formatRawResultSummary } from "@/data/profileTestScoring"

import { useInteractiveMotion } from "@/hooks/useInteractiveMotion"

import { translate } from "@/i18n/translate"

import { eliteForgeColors } from "@/theme/eliteForgeColors"

const TEST_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  sprint30m: "flash-outline",

  illinoisAgility: "shuffle-outline",

  loughboroughPass: "football-outline",

  defenseControl: "shield-outline",

  attackShots16m: "locate-outline",

  beepTest: "heart-outline",
}

function formatRetakeDate(date: Date): string {
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short" })
}

export interface PhysicalTestCardProps {
  definition: PhysicalTestDefinition

  state: PhysicalTestState

  onStart: () => void
}

export function PhysicalTestCard({ definition, state, onStart }: PhysicalTestCardProps) {
  const motion = useInteractiveMotion("button")

  const availability = getTestAvailability(state)

  const isCompleted = availability === "completed"

  const nextRetake = getNextRetakeDate(state.lastCompletedAt)

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

          backgroundColor="rgba(0,206,200,0.12)"

          alignItems="center"

          justifyContent="center"
        >
          <Ionicons
            name={TEST_ICONS[definition.id] ?? "fitness-outline"}

            size={22}

            color={eliteForgeColors.emerald}
          />
        </XStack>

        <YStack flex={1} gap={4}>
          <XStack alignItems="center" justifyContent="space-between" gap={8}>
            <Text color={eliteForgeColors.white} fontWeight="700" fontSize={15} flex={1}>
              {translate(definition.titleKey as never)}
            </Text>

            <XStack
              paddingHorizontal={8}

              paddingVertical={3}

              borderRadius={999}

              backgroundColor={isCompleted ? "rgba(0,206,200,0.18)" : "rgba(255,140,0,0.14)"}
            >
              <Text
                color={isCompleted ? eliteForgeColors.emerald : eliteForgeColors.orange}

                fontSize={10}

                fontWeight="800"
              >
                {isCompleted
                  ? translate("profileScreen:testCompleted")
                  : translate("profileScreen:testAvailable")}
              </Text>
            </XStack>
          </XStack>

          <Text color={eliteForgeColors.emerald} fontSize={11} fontWeight="700">
            {translate(`profileScreen:stat_${definition.statKey}` as never)}
          </Text>

          <Text color="rgba(255,255,255,0.55)" fontSize={12} lineHeight={18}>
            {translate(definition.descriptionKey as never)}
          </Text>

          {isCompleted && state.rawResult && state.score != null && (
            <Text color="rgba(255,255,255,0.45)" fontSize={11}>
              {translate("profileScreen:lastResult", {
                raw: formatRawResultSummary(state.rawResult),

                score: state.score,
              })}
            </Text>
          )}
        </YStack>
      </XStack>

      <Pressable
        onPress={onStart}

        disabled={isCompleted}

        onPressIn={motion.onPressIn}

        onPressOut={motion.onPressOut}

        accessibilityRole="button"
      >
        <Animated.View style={motion.animatedStyle}>
          <XStack
            borderRadius={12}

            paddingVertical={12}

            alignItems="center"

            justifyContent="center"

            backgroundColor={isCompleted ? "rgba(255,255,255,0.06)" : "rgba(0,206,200,0.16)"}

            borderWidth={1}

            borderColor={isCompleted ? eliteForgeColors.carbonBorder : eliteForgeColors.emerald}

            opacity={isCompleted ? 0.7 : 1}
          >
            <Text
              color={isCompleted ? "rgba(255,255,255,0.55)" : eliteForgeColors.emerald}

              fontWeight="800"

              fontSize={13}
            >
              {isCompleted
                ? translate("profileScreen:testRetakeOn", {
                    date: nextRetake ? formatRetakeDate(nextRetake) : "—",
                  })
                : translate("profileScreen:testStart")}
            </Text>
          </XStack>
        </Animated.View>
      </Pressable>
    </YStack>
  )
}
