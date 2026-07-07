import { Pressable, View } from "react-native"
import Animated from "react-native-reanimated"
import { XStack, YStack } from "tamagui"

import { useInteractiveMotion } from "@/hooks/useInteractiveMotion"
import { translate } from "@/i18n/translate"

export interface FeedMenuButtonProps {
  onPress: () => void
}

const LINE_WIDTH = 22
const LINE_HEIGHT = 2.5

function MenuLine({ width = LINE_WIDTH }: { width?: number }) {
  return (
    <View
      style={{
        width,
        height: LINE_HEIGHT,
        backgroundColor: "#FFFFFF",
        borderRadius: 2,
      }}
    />
  )
}

export function FeedMenuButton({ onPress }: FeedMenuButtonProps) {
  const motion = useInteractiveMotion("button")

  return (
    <Pressable
      onPress={onPress}
      onPressIn={motion.onPressIn}
      onPressOut={motion.onPressOut}
      onHoverIn={motion.onHoverIn}
      onHoverOut={motion.onHoverOut}
      accessibilityRole="button"
      accessibilityLabel={translate("feedScreen:openMenu")}
      hitSlop={8}
    >
      <Animated.View style={motion.animatedStyle}>
        <XStack
          width={44}
          height={44}
          borderRadius={12}
          backgroundColor="#2e2e2e"
          borderWidth={1}
          borderColor="#555555"
          alignItems="center"
          justifyContent="center"
        >
          <YStack gap={5} alignItems="center">
            <MenuLine />
            <MenuLine width={18} />
            <MenuLine />
          </YStack>
        </XStack>
      </Animated.View>
    </Pressable>
  )
}
