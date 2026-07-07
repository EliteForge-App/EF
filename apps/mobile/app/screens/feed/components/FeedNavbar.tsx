import { XStack, YStack } from "tamagui"

import { useAuth } from "@/context/AuthContext"
import { translate } from "@/i18n/translate"
import { EliteForgeLogo } from "@/components/ui"

import { FeedAvatar } from "./FeedAvatar"
import { FeedMenuButton } from "./FeedMenuButton"

export interface FeedNavbarProps {
  onMenuPress: () => void
  onProfilePress: () => void
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

export function FeedNavbar({ onMenuPress, onProfilePress }: FeedNavbarProps) {
  const { authEmail } = useAuth()

  return (
    <YStack backgroundColor="#363636" borderBottomWidth={1} borderBottomColor="#555555">
      <XStack height={3}>
        <YStack flex={1} backgroundColor="#00CEC8" />
        <YStack flex={1} backgroundColor="#FF8C00" />
      </XStack>

      <XStack alignItems="center" paddingHorizontal={12} paddingVertical={10} gap={8}>
        <FeedMenuButton onPress={onMenuPress} />

        <XStack flex={1} alignItems="center" justifyContent="center">
          <EliteForgeLogo width={32} />
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
    </YStack>
  )
}
