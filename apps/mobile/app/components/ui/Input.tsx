import { useState } from "react"
import {
  Platform,
  Pressable,
  View,
  type NativeSyntheticEvent,
  type TextInputFocusEventData,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Animated from "react-native-reanimated"
import {
  Input as TamaguiInput,
  Label,
  XStack,
  YStack,
  type InputProps as TamaguiInputProps,
} from "tamagui"

import { useInteractiveMotion } from "@/hooks/useInteractiveMotion"
import { eliteForgeColors } from "@/theme/eliteForgeColors"

export interface AppInputProps extends Omit<TamaguiInputProps, "value" | "onChangeText"> {
  label: string
  value: string
  onChangeText: (text: string) => void
  secureTextEntry?: boolean
}

const TOGGLE_SIZE = 44

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

  const handleFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(true)
    motion.onFocus()
    onFocus?.(event)
  }

  const handleBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
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
            ai="center"
            minHeight={TOGGLE_SIZE}
            animation="quick"
            hoverStyle={
              Platform.OS === "web"
                ? { borderColor: "$efEmerald", bg: "#3f3f3f" }
                : undefined
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
              placeholderTextColor="rgba(255,255,255,0.35)"
              borderWidth={0}
              bg="transparent"
              fontSize="$4"
              height={TOGGLE_SIZE}
              px="$3"
              py={0}
              pr={secureTextEntry ? "$1" : "$3"}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...props}
            />
            {secureTextEntry ? (
              <Pressable
                onPress={() => setHidden((v) => !v)}
                accessibilityRole="button"
                accessibilityLabel={hidden ? "Mostrar contraseña" : "Ocultar contraseña"}
                hitSlop={4}
                style={{
                  width: TOGGLE_SIZE,
                  height: TOGGLE_SIZE,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={hidden ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color={eliteForgeColors.emerald}
                />
              </Pressable>
            ) : null}
          </XStack>
        </Animated.View>
      </View>
    </YStack>
  )
}
