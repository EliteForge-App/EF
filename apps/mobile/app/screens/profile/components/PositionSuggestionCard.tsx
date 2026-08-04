import { Text, XStack, YStack } from "tamagui"

import type { PositionSuggestion } from "@/data/suggestPlayerPosition"
import { translate } from "@/i18n/translate"
import { eliteForgeColors } from "@/theme/eliteForgeColors"

export interface PositionSuggestionCardProps {
  suggestion: PositionSuggestion
  favoritePositionLabel?: string
}

export function PositionSuggestionCard({
  suggestion,
  favoritePositionLabel,
}: PositionSuggestionCardProps) {
  const dominantLabels = suggestion.dominantStats
    .map((key) => translate(`profileScreen:stat_${key}` as never))
    .join(" · ")

  return (
    <YStack
      borderRadius={16}
      borderWidth={1}
      borderColor="rgba(255,140,0,0.35)"
      backgroundColor="rgba(255,140,0,0.08)"
      padding={16}
      gap={10}
    >
      <XStack alignItems="center" justifyContent="space-between" gap={8}>
        <Text color={eliteForgeColors.orange} fontSize={11} fontWeight="800">
          {translate("profileScreen:positionSuggestionTitle")}
        </Text>
        <XStack
          paddingHorizontal={8}
          paddingVertical={3}
          borderRadius={999}
          backgroundColor="rgba(255,140,0,0.18)"
        >
          <Text color={eliteForgeColors.orange} fontSize={10} fontWeight="800">
            {translate("profileScreen:positionSuggestionConfidence", {
              value: suggestion.confidence,
            })}
          </Text>
        </XStack>
      </XStack>

      <Text color={eliteForgeColors.white} fontWeight="800" fontSize={22}>
        {translate(suggestion.labelKey)}
      </Text>

      <Text color="rgba(255,255,255,0.65)" fontSize={13} lineHeight={19}>
        {favoritePositionLabel
          ? translate("profileScreen:positionSuggestionWithFavorite", {
              favorite: favoritePositionLabel,
              suggested: translate(suggestion.labelKey),
            })
          : suggestion.isReady
            ? translate("profileScreen:positionSuggestionReady", {
                stats: dominantLabels,
                tests: suggestion.completedTests,
              })
            : translate("profileScreen:positionSuggestionPartial", {
                current: suggestion.completedTests,
                required: 3,
              })}
      </Text>

      {!suggestion.isReady && (
        <Text color="rgba(255,255,255,0.45)" fontSize={11} lineHeight={16}>
          {translate("profileScreen:positionSuggestionMoreTests")}
        </Text>
      )}

      {suggestion.psychInfluenced && (
        <Text color="rgba(255,255,255,0.45)" fontSize={11} lineHeight={16}>
          {translate("profileScreen:positionSuggestionPsychInfluence")}
        </Text>
      )}
    </YStack>
  )
}
