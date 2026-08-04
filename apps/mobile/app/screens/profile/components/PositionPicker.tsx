import { Pressable } from "react-native"
import { Text, XStack, YStack } from "tamagui"

import { ALL_PLAYER_POSITIONS, type PlayerPositionId } from "@/data/suggestPlayerPosition"
import { translate } from "@/i18n/translate"
import { eliteForgeColors } from "@/theme/eliteForgeColors"

export interface PositionPickerProps {
  selectedId: PlayerPositionId | null
  onSelect: (id: PlayerPositionId | null) => void
}

export function PositionPicker({ selectedId, onSelect }: PositionPickerProps) {
  return (
    <YStack gap={10}>
      <XStack flexWrap="wrap" gap={8}>
        {ALL_PLAYER_POSITIONS.map((id) => {
          const isSelected = selectedId === id
          return (
            <Pressable key={id} onPress={() => onSelect(isSelected ? null : id)}>
              <XStack
                paddingHorizontal={12}
                paddingVertical={8}
                borderRadius={999}
                backgroundColor={isSelected ? "rgba(0,206,200,0.18)" : "rgba(255,255,255,0.06)"}
                borderWidth={1}
                borderColor={isSelected ? eliteForgeColors.emerald : eliteForgeColors.carbonBorder}
              >
                <Text
                  color={isSelected ? eliteForgeColors.emerald : "rgba(255,255,255,0.75)"}
                  fontSize={12}
                  fontWeight="700"
                >
                  {translate(`profileScreen:position_${id}` as never)}
                </Text>
              </XStack>
            </Pressable>
          )
        })}
      </XStack>
      {selectedId && (
        <Pressable onPress={() => onSelect(null)}>
          <Text color="rgba(255,255,255,0.45)" fontSize={11}>
            {translate("profileScreen:favoritePositionClear")}
          </Text>
        </Pressable>
      )}
    </YStack>
  )
}
