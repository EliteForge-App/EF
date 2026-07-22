import { Pressable } from "react-native"
import Animated from "react-native-reanimated"
import { Button as TamaguiButton, type ButtonProps as TamaguiButtonProps } from "tamagui"

import { useInteractiveMotion } from "@/hooks/useInteractiveMotion"

export type AppButtonVariant = "primary" | "secondary" | "outline" | "ghost"

export interface AppButtonProps extends Omit<TamaguiButtonProps, "variant"> {
  variant?: AppButtonVariant
}

const variantStyles: Record<AppButtonVariant, Partial<TamaguiButtonProps>> = {
  primary: {
    bg: "$efEmerald",
    color: "$efWhite",
    hoverStyle: { bg: "#00ddd6" },
    pressStyle: { bg: "#00b5b0" },
  },
  secondary: {
    bg: "$efOrange",
    color: "$efWhite",
    hoverStyle: { bg: "#ff9a1a" },
    pressStyle: { bg: "#e67e00" },
  },
  outline: {
    bg: "transparent",
    borderWidth: 1,
    borderColor: "$efEmerald",
    color: "$efEmerald",
    hoverStyle: { bg: "rgba(0, 206, 200, 0.12)", borderColor: "#00ddd6" },
    pressStyle: { bg: "rgba(0, 206, 200, 0.18)" },
  },
  ghost: {
    bg: "transparent",
    color: "$efEmerald",
    hoverStyle: { bg: "rgba(0, 206, 200, 0.1)" },
    pressStyle: { bg: "rgba(0, 206, 200, 0.14)" },
  },
}

export function Button({
  variant = "primary",
  children,
  onPress,
  width,
  flex,
  ...props
}: AppButtonProps) {
  const motion = useInteractiveMotion("button")
  const fillWidth = width === "100%" || flex === 1

  return (
    <Pressable
      onPress={onPress}
      onPressIn={motion.onPressIn}
      onPressOut={motion.onPressOut}
      onHoverIn={motion.onHoverIn}
      onHoverOut={motion.onHoverOut}
      style={{
        flex: typeof flex === "number" ? flex : undefined,
        width: fillWidth && flex === undefined ? "100%" : undefined,
        alignSelf: fillWidth && flex === undefined ? "stretch" : undefined,
        minWidth: typeof flex === "number" ? 120 : 0,
        flexShrink: typeof flex === "number" ? 1 : undefined,
      }}
    >
      <Animated.View style={[{ flex: typeof flex === "number" ? 1 : undefined }, motion.animatedStyle]}>
        <TamaguiButton
          pointerEvents="none"
          animation="quick"
          rounded="$3"
          fontWeight="700"
          fontSize="$4"
          px="$4"
          py="$3"
          height="$5"
          width={flex !== undefined ? "100%" : width}
          {...variantStyles[variant]}
          {...props}
        >
          {children}
        </TamaguiButton>
      </Animated.View>
    </Pressable>
  )
}
