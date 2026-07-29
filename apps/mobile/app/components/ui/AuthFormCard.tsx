import type { ReactNode } from "react"
import { Platform, View, type ViewProps } from "react-native"
import Animated from "react-native-reanimated"
import { XStack, YStack } from "tamagui"

import { useInteractiveMotion } from "@/hooks/useInteractiveMotion"

export interface AuthFormCardProps extends ViewProps {
  children: ReactNode
}

export function AuthFormCard({ children, ...props }: AuthFormCardProps) {
  const motion = useInteractiveMotion("card")

  return (
    <View {...motion.hoverHandlers} {...props}>
      <Animated.View style={motion.animatedStyle}>
        <YStack
          width="100%"
          bg="#363636"
          borderRadius={16}
          overflow="hidden"
          borderWidth={1}
          borderColor="#555555"
          hoverStyle={
            Platform.OS === "web"
              ? { borderColor: "#00CEC8", bg: "#3a3a3a" }
              : undefined
          }
        >
          <XStack height={3} width="100%">
            <YStack flex={1} bg="#00CEC8" />
            <YStack flex={1} bg="#FF8C00" />
          </XStack>

          {children}
        </YStack>
      </Animated.View>
    </View>
  )
}
