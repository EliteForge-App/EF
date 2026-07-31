import { Platform, useWindowDimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const TABLET_MIN_WIDTH = 768
const SMALL_HEIGHT = 700
const SMALL_WIDTH = 360

export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const isSmallScreen = height < SMALL_HEIGHT || width < SMALL_WIDTH
  const isTablet = width >= TABLET_MIN_WIDTH

  const horizontalPadding = Math.max(12, Math.round(width * 0.04))
  /** En teléfono usa casi todo el ancho útil; en tablet limita para legibilidad */
  const contentMaxWidth = isTablet
    ? Math.min(width - horizontalPadding * 2, 520)
    : width - horizontalPadding * 2
  const logoWidth = Math.min(width * (isSmallScreen ? 0.7 : 0.78), isTablet ? 340 : 300)
  const sectionGap = isSmallScreen ? 14 : isTablet ? 28 : 22
  const titleSize = isSmallScreen ? 28 : isTablet ? 36 : 32

  return {
    screenWidth: width,
    screenHeight: height,
    insets,
    horizontalPadding,
    contentMaxWidth,
    logoWidth,
    sectionGap,
    titleSize,
    isSmallScreen,
    isTablet,
    keyboardVerticalOffset: Platform.OS === "ios" ? insets.top : 0,
  }
}
