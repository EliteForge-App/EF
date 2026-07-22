import { Pressable, type GestureResponderEvent, type StyleProp, type ViewStyle } from "react-native"
import Animated from "react-native-reanimated"
import { Text, XStack, type XStackProps } from "tamagui"

import { useInteractiveMotion } from "@/hooks/useInteractiveMotion"

export type SocialProvider = "google" | "facebook"

export interface SocialButtonProps extends Omit<XStackProps, "children" | "flex"> {
  provider: SocialProvider
  label: string
  /** Fila horizontal con texto corto (Gmail / Facebook). */
  compact?: boolean
  /** Solo marca — botón cuadrado minimalista para la fila de login. */
  iconOnly?: boolean
  compactLabel?: string
  /** Flex del contenedor Pressable (modos con texto). */
  flex?: number
  onPress?: (event: GestureResponderEvent) => void
}

const ICON_SIZE = 32
const ICON_SIZE_COMPACT = 22
const BUTTON_HEIGHT = 52
const BUTTON_HEIGHT_COMPACT = 44
/** Tamaño fijo de los botones sociales en la fila de login */
const ICON_ONLY_SIZE = 40

const providerStyles: Record<
  SocialProvider,
  {
    bg: string
    hoverBg: string
    badge: string
    badgeColor: string
    borderColor: string
    /** Estilo clásico a ancho completo */
    solidBg: string
    solidHoverBg: string
    solidBadgeBg: string
    solidBorderWidth: number
  }
> = {
  google: {
    bg: "rgba(255,255,255,0.06)",
    hoverBg: "rgba(255,255,255,0.12)",
    badge: "G",
    badgeColor: "#EA4335",
    borderColor: "rgba(255,255,255,0.22)",
    solidBg: "#FFFFFF",
    solidHoverBg: "#F5F5F5",
    solidBadgeBg: "#FFFFFF",
    solidBorderWidth: 1,
  },
  facebook: {
    bg: "rgba(24,119,242,0.12)",
    hoverBg: "rgba(24,119,242,0.2)",
    badge: "f",
    badgeColor: "#4B9BFF",
    borderColor: "rgba(75,155,255,0.35)",
    solidBg: "#1877F2",
    solidHoverBg: "#1a82ff",
    solidBadgeBg: "rgba(255,255,255,0.2)",
    solidBorderWidth: 0,
  },
}

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
            backgroundColor={style.bg}
            borderRadius={10}
            borderWidth={1}
            borderColor={style.borderColor}
            animation="quick"
            hoverStyle={{ bg: style.hoverBg }}
            {...props}
          >
            <Text
              fontWeight="700"
              fontSize={provider === "facebook" ? 18 : 15}
              color={style.badgeColor}
              lineHeight={20}
            >
              {style.badge}
            </Text>
          </XStack>
        </Animated.View>
      </Pressable>
    )
  }

  const iconSize = compact ? ICON_SIZE_COMPACT : ICON_SIZE
  const buttonHeight = compact ? BUTTON_HEIGHT_COMPACT : BUTTON_HEIGHT

  const pressableStyle: StyleProp<ViewStyle> = {
    flex: flex ?? (compact ? 1 : undefined),
    width: compact || flex !== undefined ? undefined : "100%",
    minWidth: 0,
    flexShrink: 1,
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
      <Animated.View style={[{ width: "100%" }, motion.animatedStyle]}>
        <XStack
          height={buttonHeight}
          width="100%"
          alignItems="center"
          justifyContent="center"
          backgroundColor={style.solidBg}
          borderRadius={compact ? 10 : 12}
          borderWidth={style.solidBorderWidth}
          borderColor="#555555"
          paddingHorizontal={compact ? 8 : 16}
          position="relative"
          gap={compact ? 6 : 0}
          animation="quick"
          hoverStyle={{ bg: style.solidHoverBg }}
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
            backgroundColor={style.solidBadgeBg}
            borderWidth={provider === "google" ? 1 : 0}
            borderColor="#E0E0E0"
            flexShrink={0}
          >
            <Text
              fontWeight="800"
              fontSize={compact ? 14 : 16}
              color={provider === "google" ? "#4285F4" : "#FFFFFF"}
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
              fontSize={12}
              color={provider === "google" ? "#424242" : "#FFFFFF"}
              numberOfLines={1}
              flexShrink={1}
            >
              {compactLabel ?? label}
            </Text>
          )}
        </XStack>
      </Animated.View>
    </Pressable>
  )
}
