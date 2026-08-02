import { useCallback } from "react"
import { Platform } from "react-native"
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type WithSpringConfig,
} from "react-native-reanimated"

const SPRING: WithSpringConfig = { damping: 20, stiffness: 320, mass: 0.55 }

export const MOTION_PRESETS = {
  button: { hoverScale: 1.02, pressScale: 0.97, hoverY: -2, pressY: 0 },
  social: { hoverScale: 1.03, pressScale: 0.96, hoverY: -2, pressY: 1 },
  card: { hoverScale: 1.006, pressScale: 1, hoverY: -3, pressY: 0 },
  input: { hoverScale: 1.012, pressScale: 1, hoverY: -1, pressY: 0, focusScale: 1.012, focusY: -1 },
} as const

export type MotionPreset = keyof typeof MOTION_PRESETS

export function useInteractiveMotion(preset: MotionPreset = "button") {
  const config = MOTION_PRESETS[preset]
  const scale = useSharedValue(1)
  const translateY = useSharedValue(0)

  const animateTo = useCallback(
    (targetScale: number, targetY: number) => {
      scale.value = withSpring(targetScale, SPRING)
      translateY.value = withSpring(targetY, SPRING)
    },
    [scale, translateY],
  )

  const reset = useCallback(() => animateTo(1, 0), [animateTo])

  const onHoverIn = useCallback(
    () => animateTo(config.hoverScale, config.hoverY),
    [animateTo, config.hoverScale, config.hoverY],
  )

  const onHoverOut = useCallback(() => reset(), [reset])

  const onPressIn = useCallback(
    () => animateTo(config.pressScale, config.pressY),
    [animateTo, config.pressScale, config.pressY],
  )

  const onPressOut = useCallback(() => reset(), [reset])

  const onFocus = useCallback(() => {
    if (preset === "input") {
      const inputConfig = MOTION_PRESETS.input
      animateTo(inputConfig.focusScale, inputConfig.focusY)
      return
    }
    onHoverIn()
  }, [animateTo, onHoverIn, preset])

  const onBlur = useCallback(() => reset(), [reset])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }))

  const hoverHandlers =
    Platform.OS === "web" ? { onMouseEnter: onHoverIn, onMouseLeave: onHoverOut } : {}

  return {
    animatedStyle,
    onPressIn,
    onPressOut,
    onHoverIn,
    onHoverOut,
    onFocus,
    onBlur,
    hoverHandlers,
  }
}
