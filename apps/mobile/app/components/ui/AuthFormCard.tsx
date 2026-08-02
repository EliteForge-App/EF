import type { ReactNode } from "react"
import { Platform, View, type ViewProps } from "react-native"
import Animated from "react-native-reanimated"
import { XStack, YStack } from "tamagui"

import { useInteractiveMotion } from "@/hooks/useInteractiveMotion"

export interface AuthFormCardProps extends ViewProps {
  children: ReactNode
}

export function AuthFormCard({ children, style, ...props }: AuthFormCardProps) {
  const motion = useInteractiveMotion("card")

  return (
    <View style={[{ width: "100%" }, style]} {...motion.hoverHandlers} {...props}>
      <Animated.View style={[{ width: "100%" }, motion.animatedStyle]}>
        <YStack
          width="100%"
          backgroundColor="#363636"
          borderRadius={16}
          overflow="hidden"
          borderWidth={1}
          borderColor="#555555"
          hoverStyle={
            Platform.OS === "web"
              ? { borderColor: "#00CEC8", backgroundColor: "#3a3a3a" }
              : undefined
          }
        >
          <XStack height={3} width="100%">
            <YStack flex={1} backgroundColor="#00CEC8" />
            <YStack flex={1} backgroundColor="#FF8C00" />
          </XStack>

          {children}
        </YStack>
      </Animated.View>
    </View>
  )
}
