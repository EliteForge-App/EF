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
  ...props
}: AppButtonProps) {
  const motion = useInteractiveMotion("button")

  return (
    <Pressable
      onPress={onPress}
      onPressIn={motion.onPressIn}
      onPressOut={motion.onPressOut}
      onHoverIn={motion.onHoverIn}
      onHoverOut={motion.onHoverOut}
      style={{ width: width === "100%" ? "100%" : undefined, alignSelf: width === "100%" ? "stretch" : undefined }}
    >
      <Animated.View style={motion.animatedStyle}>
        <TamaguiButton
          pointerEvents="none"
          rounded="$3"
          fontWeight="700"
          fontSize="$4"
          px="$4"
          py="$3"
          height="$5"
          width={width}
          {...variantStyles[variant]}
          {...props}
        >
          {children}
        </TamaguiButton>
      </Animated.View>
    </Pressable>
  )
}
