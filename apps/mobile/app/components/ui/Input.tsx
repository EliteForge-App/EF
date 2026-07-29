import { useState } from "react"
import { Platform, Pressable, View } from "react-native"
import Animated from "react-native-reanimated"
import {
  Input as TamaguiInput,
  Label,
  Text,
  XStack,
  YStack,
  type InputProps as TamaguiInputProps,
} from "tamagui"

import { useInteractiveMotion } from "@/hooks/useInteractiveMotion"

export interface AppInputProps extends Omit<TamaguiInputProps, "value" | "onChangeText"> {
  label: string
  value: string
  onChangeText: (text: string) => void
  secureTextEntry?: boolean
}

export function Input({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  placeholder,
  onFocus,
  onBlur,
  ...props
}: AppInputProps) {
  const [hidden, setHidden] = useState(secureTextEntry)
  const [focused, setFocused] = useState(false)
  const motion = useInteractiveMotion("input")

  const handleFocus: NonNullable<TamaguiInputProps["onFocus"]> = (event) => {
    setFocused(true)
    motion.onFocus()
    onFocus?.(event)
  }

  const handleBlur: NonNullable<TamaguiInputProps["onBlur"]> = (event) => {
    setFocused(false)
    motion.onBlur()
    onBlur?.(event)
  }

  return (
    <YStack gap="$2">
      <Label color="$efWhite" fontSize="$3" fontWeight="600" opacity={0.9}>
        {label}
      </Label>
      <View {...motion.hoverHandlers}>
        <Animated.View style={motion.animatedStyle}>
          <XStack
            bg="$efCarbonInput"
            borderWidth={1}
            borderColor={focused ? "$efEmerald" : "$efCarbonBorder"}
            rounded="$3"
            alignItems="center"
            hoverStyle={
              Platform.OS === "web" ? { borderColor: "$efEmerald", bg: "#3f3f3f" } : undefined
            }
          >
            <TamaguiInput
              flex={1}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              secureTextEntry={hidden}
              autoCapitalize="none"
              autoCorrect={false}
              color="$efWhite"
              placeholderTextColor="$efMutedSurface"
              borderWidth={0}
              bg="transparent"
              fontSize="$4"
              px="$3"
              py="$3"
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...props}
            />
            {secureTextEntry ? (
              <Pressable onPress={() => setHidden((v) => !v)} hitSlop={8}>
                <Text color="$efEmerald" fontSize="$3" fontWeight="600" px="$3">
                  {hidden ? "Ver" : "Ocultar"}
                </Text>
              </Pressable>
            ) : null}
          </XStack>
        </Animated.View>
      </View>
    </YStack>
  )
}
