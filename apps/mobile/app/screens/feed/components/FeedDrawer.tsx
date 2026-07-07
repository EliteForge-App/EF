import { Pressable } from "react-native"
import Animated from "react-native-reanimated"
import { Text, XStack, YStack } from "tamagui"

import { useAuth } from "@/context/AuthContext"
import { useInteractiveMotion } from "@/hooks/useInteractiveMotion"
import { translate } from "@/i18n/translate"
import { EliteForgeLogo } from "@/components/ui"

import { FeedAvatar } from "./FeedAvatar"

export type FeedDrawerItemId = "profile" | "groups" | "matches" | "reservations"

export interface FeedDrawerProps {
  onClose: () => void
  onItemPress: (id: FeedDrawerItemId) => void
  onLogout: () => void
}

const MENU_ITEMS: { id: FeedDrawerItemId; icon: string; labelKey: string }[] = [
  { id: "profile", icon: "👤", labelKey: "feedDrawer:profile" },
  { id: "groups", icon: "👥", labelKey: "feedDrawer:groups" },
  { id: "matches", icon: "⚽", labelKey: "feedDrawer:matches" },
  { id: "reservations", icon: "🏟️", labelKey: "feedDrawer:reservations" },
]

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

function DrawerMenuItem({
  icon,
  label,
  onPress,
}: {
  icon: string
  label: string
  onPress: () => void
}) {
  const motion = useInteractiveMotion("button")

  return (
    <Pressable
      onPress={onPress}
      onPressIn={motion.onPressIn}
      onPressOut={motion.onPressOut}
      onHoverIn={motion.onHoverIn}
      onHoverOut={motion.onHoverOut}
      accessibilityRole="button"
    >
      <Animated.View style={motion.animatedStyle}>
        <XStack
          alignItems="center"
          gap={14}
          paddingVertical={14}
          paddingHorizontal={16}
          borderRadius={12}
          backgroundColor="#2e2e2e"
          borderWidth={1}
          borderColor="#555555"
          marginBottom={10}
        >
          <Text fontSize={20}>{icon}</Text>
          <YStack flex={1} gap={2}>
            <Text color="#FFFFFF" fontWeight="700" fontSize={15}>
              {label}
            </Text>
            <Text color="rgba(255,255,255,0.45)" fontSize={12}>
              {translate("feedDrawer:comingSoon")}
            </Text>
          </YStack>
          <Text color="#00CEC8" fontSize={16}>
            ›
          </Text>
        </XStack>
      </Animated.View>
    </Pressable>
  )
}

export function FeedDrawer({ onClose, onItemPress, onLogout }: FeedDrawerProps) {
  const { authEmail } = useAuth()
  const logoutMotion = useInteractiveMotion("button")

  return (
    <YStack flex={1} backgroundColor="#424242" paddingTop={48}>
      <XStack height={3}>
        <YStack flex={1} backgroundColor="#00CEC8" />
        <YStack flex={1} backgroundColor="#FF8C00" />
      </XStack>

      <YStack padding={20} gap={20} flex={1}>
        <XStack alignItems="center" justifyContent="space-between">
          <EliteForgeLogo width={48} />
          <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button">
            <Text color="#00CEC8" fontSize={22} fontWeight="700">
              ✕
            </Text>
          </Pressable>
        </XStack>

        <XStack alignItems="center" gap={14} paddingVertical={8}>
          <FeedAvatar
            label={getUserDisplayName(authEmail)}
            color={getUserColor(authEmail)}
            size={56}
            showRing
          />
          <YStack flex={1} gap={4}>
            <Text color="#FFFFFF" fontWeight="800" fontSize={18}>
              {getUserDisplayName(authEmail)}
            </Text>
            <Text color="rgba(255,255,255,0.55)" fontSize={13} numberOfLines={1}>
              {authEmail ?? translate("feedScreen:guestUser")}
            </Text>
          </YStack>
        </XStack>

        <Text color="rgba(255,255,255,0.45)" fontSize={12} fontWeight="700" letterSpacing={1}>
          {translate("feedDrawer:sectionMenu").toUpperCase()}
        </Text>

        <YStack flex={1}>
          {MENU_ITEMS.map((item) => (
            <DrawerMenuItem
              key={item.id}
              icon={item.icon}
              label={translate(item.labelKey as never)}
              onPress={() => onItemPress(item.id)}
            />
          ))}
        </YStack>

        <Pressable
          onPress={onLogout}
          onPressIn={logoutMotion.onPressIn}
          onPressOut={logoutMotion.onPressOut}
          accessibilityRole="button"
        >
          <Animated.View style={logoutMotion.animatedStyle}>
            <XStack
              backgroundColor="rgba(255, 140, 0, 0.15)"
              borderRadius={12}
              borderWidth={1}
              borderColor="#FF8C00"
              paddingVertical={14}
              alignItems="center"
              justifyContent="center"
            >
              <Text color="#FF8C00" fontWeight="800" fontSize={15}>
                {translate("common:logOut")}
              </Text>
            </XStack>
          </Animated.View>
        </Pressable>
      </YStack>
    </YStack>
  )
}
