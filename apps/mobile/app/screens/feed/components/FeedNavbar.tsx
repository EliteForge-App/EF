import { Image, type ImageStyle, type StyleProp } from "react-native"
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated"
import { XStack, YStack } from "tamagui"

import { useAuth } from "@/context/AuthContext"
import { translate } from "@/i18n/translate"

import { FeedAvatar } from "./FeedAvatar"
import { FeedMenuButton } from "./FeedMenuButton"
import {
  FEED_NAV_LOGO_COLLAPSED,
  FEED_NAV_LOGO_EXPANDED,
  FEED_NAV_SCROLL_DISTANCE,
} from "../feedNavConstants"

const eliteForgeLogo = require("@assets/images/elite-forge-logo.png")

export interface FeedNavbarProps {
  onMenuPress: () => void
  onProfilePress: () => void
  /** Offset de scroll del feed para colapsar la barra */
  scrollY: SharedValue<number>
}

function getUserDisplayName(email?: string) {
  if (!email) return translate("feedScreen:guestUser")
  const local = email.split("@")[0] ?? email
  return local.charAt(0).toUpperCase() + local.slice(1)
}

function getUserColor(email?: string) {
  if (!email) return "#00CEC8"
  const hash = email.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const palette = ["#00CEC8", "#FF8C00", "#7B68EE", "#2ECC71", "#E74C3C"]
  return palette[hash % palette.length]
}

export function FeedNavbar({ onMenuPress, onProfilePress, scrollY }: FeedNavbarProps) {
  const { authEmail } = useAuth()

  const barStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      scrollY.value,
      [0, FEED_NAV_SCROLL_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP,
    )
    return {
      paddingVertical: interpolate(progress, [0, 1], [12, 6]),
      shadowOpacity: interpolate(progress, [0, 1], [0.08, 0.22]),
      elevation: interpolate(progress, [0, 1], [2, 8]),
    }
  })

  const logoStyle = useAnimatedStyle(() => {
    const size = interpolate(
      scrollY.value,
      [0, FEED_NAV_SCROLL_DISTANCE],
      [FEED_NAV_LOGO_EXPANDED, FEED_NAV_LOGO_COLLAPSED],
      Extrapolation.CLAMP,
    )
    return {
      width: size,
      height: size * 1.05,
      opacity: interpolate(scrollY.value, [0, FEED_NAV_SCROLL_DISTANCE], [1, 0.92], Extrapolation.CLAMP),
    }
  })

  const accentStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [0, FEED_NAV_SCROLL_DISTANCE],
      [3, 2],
      Extrapolation.CLAMP,
    ),
  }))

  const logoImageStyle: StyleProp<ImageStyle> = {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  }

  return (
    <YStack
      backgroundColor="rgba(54,54,54,0.97)"
      borderBottomWidth={1}
      borderBottomColor="rgba(85,85,85,0.9)"
      zIndex={20}
    >
      <Animated.View style={accentStyle}>
        <XStack height="100%" width="100%">
          <YStack flex={1} backgroundColor="#00CEC8" />
          <YStack flex={1} backgroundColor="#FF8C00" />
        </XStack>
      </Animated.View>

      <Animated.View style={[{ paddingHorizontal: 12 }, barStyle]}>
        <XStack alignItems="center" gap={10}>
          <FeedMenuButton onPress={onMenuPress} compactScrollY={scrollY} />

          <XStack flex={1} alignItems="center" justifyContent="center">
            <Animated.View style={logoStyle}>
              <Image
                source={eliteForgeLogo}
                style={logoImageStyle}
                resizeMode="contain"
                accessibilityLabel="Elite Forge"
              />
            </Animated.View>
          </XStack>

          <FeedAvatar
            label={getUserDisplayName(authEmail)}
            color={getUserColor(authEmail)}
            size={40}
            showRing
            onPress={onProfilePress}
            accessibilityLabel={translate("feedDrawer:profile")}
          />
        </XStack>
      </Animated.View>
    </YStack>
  )
}
