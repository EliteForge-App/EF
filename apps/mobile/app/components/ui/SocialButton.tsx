import { Pressable, type GestureResponderEvent, type StyleProp, type ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Animated from "react-native-reanimated"
import { Text, XStack, type XStackProps } from "tamagui"

import { useInteractiveMotion } from "@/hooks/useInteractiveMotion"

export type SocialProvider = "google" | "facebook"

export interface SocialButtonProps extends Omit<XStackProps, "children" | "flex"> {
  provider: SocialProvider
  label: string
  compact?: boolean
  /** Solo marca — botón cuadrado alineado con la web. */
  iconOnly?: boolean
  compactLabel?: string
  flex?: number
  onPress?: (event: GestureResponderEvent) => void
}

const ICON_SIZE = 32
const ICON_SIZE_COMPACT = 26
const BUTTON_HEIGHT = 52
const BUTTON_HEIGHT_COMPACT = 44
/** Misma proporción que apps/web (size-11 ≈ 44) */
const ICON_ONLY_SIZE = 44

const providerStyles = {
  google: {
    bg: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#555555",
    badge: "G",
    badgeColor: "#EA4335",
    icon: "logo-google" as const,
    iconColor: "#4285F4",
  },
  facebook: {
    bg: "#1877F2",
    borderWidth: 0,
    borderColor: "transparent",
    badge: "f",
    badgeColor: "#FFFFFF",
    icon: "logo-facebook" as const,
    iconColor: "#FFFFFF",
  },
} as const

export function SocialButton({
  provider,
  label,
  compact = false,
  iconOnly = false,
  compactLabel,
  flex,
  onPress,
  ...props
}: SocialButtonProps) {
  const style = providerStyles[provider]
  const motion = useInteractiveMotion("social")

  if (iconOnly) {
    const pressableStyle: StyleProp<ViewStyle> = {
      width: ICON_ONLY_SIZE,
      height: ICON_ONLY_SIZE,
      flexShrink: 0,
    }

    return (
      <Pressable
        onPress={onPress}
        onPressIn={motion.onPressIn}
        onPressOut={motion.onPressOut}
        onHoverIn={motion.onHoverIn}
        onHoverOut={motion.onHoverOut}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={pressableStyle}
      >
        <Animated.View style={motion.animatedStyle}>
          <XStack
            width={ICON_ONLY_SIZE}
            height={ICON_ONLY_SIZE}
            alignItems="center"
            justifyContent="center"
            borderRadius={12}
            borderWidth={style.borderWidth}
            borderColor={style.borderColor}
            style={{ backgroundColor: style.bg }}
            {...props}
          >
            <Ionicons name={style.icon} size={22} color={style.iconColor} />
          </XStack>
        </Animated.View>
      </Pressable>
    )
  }

  const iconSize = compact ? ICON_SIZE_COMPACT : ICON_SIZE
  const buttonHeight = compact ? BUTTON_HEIGHT_COMPACT : BUTTON_HEIGHT

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
        flex: flex ?? (compact ? 1 : undefined),
        width: compact || flex !== undefined ? undefined : "100%",
      }}
    >
      <Animated.View style={motion.animatedStyle}>
        <XStack
          height={buttonHeight}
          width="100%"
          alignItems="center"
          justifyContent="center"
          borderRadius={compact ? 10 : 12}
          borderWidth={style.borderWidth}
          borderColor={style.borderColor}
          paddingHorizontal={compact ? 8 : 16}
          position="relative"
          gap={compact ? 6 : 0}
          style={{ backgroundColor: style.bg }}
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
            borderWidth={provider === "google" ? 1 : 0}
            borderColor="#E0E0E0"
            style={{
              backgroundColor:
                provider === "google" ? "#FFFFFF" : "rgba(255,255,255,0.2)",
            }}
          >
            <Ionicons
              name={style.icon}
              size={compact ? 16 : 18}
              color={style.iconColor}
            />
          </XStack>

          {!compact ? (
            <Text
              flex={1}
              textAlign="center"
              fontWeight="600"
              fontSize={15}
              style={{ color: provider === "google" ? "#424242" : "#FFFFFF" }}
              paddingHorizontal={ICON_SIZE + 8}
              numberOfLines={1}
            >
              {label}
            </Text>
          ) : (
            <Text
              fontWeight="600"
              fontSize={13}
              style={{ color: provider === "google" ? "#424242" : "#FFFFFF" }}
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
