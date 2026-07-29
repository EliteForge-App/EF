import { Pressable, type GestureResponderEvent } from "react-native"
import Animated from "react-native-reanimated"
import { Text, XStack, type XStackProps } from "tamagui"

import { useInteractiveMotion } from "@/hooks/useInteractiveMotion"

export type SocialProvider = "google" | "facebook"

export interface SocialButtonProps extends Omit<XStackProps, "children"> {
  provider: SocialProvider
  label: string
  compact?: boolean
  compactLabel?: string
  onPress?: (event: GestureResponderEvent) => void
}

const ICON_SIZE = 32
const ICON_SIZE_COMPACT = 26
const BUTTON_HEIGHT = 52
const BUTTON_HEIGHT_COMPACT = 44

const providerStyles = {
  google: {
    bg: "#FFFFFF",
    hoverBg: "#F5F5F5",
    badge: "G",
    badgeColor: "#4285F4",
    badgeBg: "#FFFFFF",
    borderWidth: 1,
  },
  facebook: {
    bg: "#1877F2",
    hoverBg: "#1a82ff",
    badge: "f",
    badgeColor: "#FFFFFF",
    badgeBg: "rgba(255,255,255,0.2)",
    borderWidth: 0,
  },
} as const satisfies Record<
  SocialProvider,
  {
    bg: `#${string}`
    hoverBg: `#${string}`
    badge: string
    badgeColor: `#${string}`
    badgeBg: `#${string}` | `rgba(${string})`
    borderWidth: number
  }
>

export function SocialButton({
  provider,
  label,
  compact = false,
  compactLabel,
  onPress,
  ...props
}: SocialButtonProps) {
  const style = providerStyles[provider]
  const iconSize = compact ? ICON_SIZE_COMPACT : ICON_SIZE
  const buttonHeight = compact ? BUTTON_HEIGHT_COMPACT : BUTTON_HEIGHT
  const motion = useInteractiveMotion("social")

  return (
    <Pressable
      onPress={onPress}
      onPressIn={motion.onPressIn}
      onPressOut={motion.onPressOut}
      onHoverIn={motion.onHoverIn}
      onHoverOut={motion.onHoverOut}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{
        flex: compact ? 1 : undefined,
        width: compact ? undefined : "100%",
      }}
    >
      <Animated.View style={motion.animatedStyle}>
        <XStack
          height={buttonHeight}
          width="100%"
          alignItems="center"
          justifyContent="center"
          backgroundColor={style.bg}
          borderRadius={compact ? 10 : 12}
          borderWidth={style.borderWidth}
          borderColor="#555555"
          paddingHorizontal={compact ? 8 : 16}
          position="relative"
          gap={compact ? 6 : 0}
          hoverStyle={{ bg: style.hoverBg }}
          {...props}
        >
          <XStack
            position={compact ? "relative" : "absolute"}
            left={compact ? undefined : 16}
            width={iconSize}
            height={iconSize}
            alignItems="center"
            justifyContent="center"
            borderRadius={iconSize / 2}
            backgroundColor={style.badgeBg}
            borderWidth={provider === "google" ? 1 : 0}
            borderColor="#E0E0E0"
          >
            <Text
              fontWeight="800"
              fontSize={compact ? 14 : 16}
              color={style.badgeColor}
              lineHeight={compact ? 16 : 18}
            >
              {style.badge}
            </Text>
          </XStack>

          {!compact ? (
            <Text
              flex={1}
              textAlign="center"
              fontWeight="600"
              fontSize={15}
              color={provider === "google" ? "#424242" : "#FFFFFF"}
              paddingHorizontal={ICON_SIZE + 8}
              numberOfLines={1}
            >
              {label}
            </Text>
          ) : (
            <Text
              fontWeight="600"
              fontSize={13}
              color={provider === "google" ? "#424242" : "#FFFFFF"}
              numberOfLines={1}
            >
              {compactLabel ?? label}
            </Text>
          )}
        </XStack>
      </Animated.View>
    </Pressable>
  )
}
