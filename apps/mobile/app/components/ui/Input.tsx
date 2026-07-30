import { useState } from "react"
import { Platform, Pressable, View } from "react-native"
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
  /** Oculta el Label (útil en filas donde el título ya está fuera). */
  hideLabel?: boolean
}

const TOGGLE_SIZE = 44

export function Input({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  hideLabel = false,
  placeholder,
  onFocus,
  onBlur,
  ...props
}: AppInputProps) {
  const [hidden, setHidden] = useState(secureTextEntry)
  const [focused, setFocused] = useState(false)
  const motion = useInteractiveMotion("input")

  return (
    <YStack gap={hideLabel || !label ? 0 : "$2"}>
      {!hideLabel && label ? (
        <Label color="$efWhite" fontSize="$3" fontWeight="600" opacity={0.9}>
          {label}
        </Label>
      ) : null}
      <View {...motion.hoverHandlers}>
        <Animated.View style={motion.animatedStyle}>
          <XStack
            backgroundColor="$efCarbonInput"
            borderWidth={1}
            borderColor={focused ? "$efEmerald" : "$efCarbonBorder"}
            borderRadius="$3"
            alignItems="center"
            minHeight={TOGGLE_SIZE}
            hoverStyle={
              Platform.OS === "web" ? { borderColor: "$efEmerald", backgroundColor: "#3f3f3f" } : undefined
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
              backgroundColor="transparent"
              fontSize={14}
              height={TOGGLE_SIZE}
              paddingHorizontal="$3"
              paddingVertical={0}
              paddingRight={secureTextEntry ? "$1" : "$3"}
              style={{ fontSize: 14 }}
              onFocus={(event) => {
                setFocused(true)
                motion.onFocus()
                onFocus?.(event)
              }}
              onBlur={(event) => {
                setFocused(false)
                motion.onBlur()
                onBlur?.(event)
              }}
              {...props}
            />
            {secureTextEntry ? (
              <Pressable
                onPress={() => setHidden((v) => !v)}
                accessibilityRole="button"
                accessibilityLabel={hidden ? "Mostrar contraseña" : "Ocultar contraseña"}
                hitSlop={4}
                style={{
                  width: 36,
                  height: TOGGLE_SIZE,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={hidden ? "eye-outline" : "eye-off-outline"}
                  size={18}
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
