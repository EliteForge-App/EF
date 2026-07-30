import { Modal, Pressable, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Text, XStack, YStack } from "tamagui"

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout"
import { translate } from "@/i18n/translate"
import { eliteForgeColors } from "@/theme/eliteForgeColors"

export interface FeedShareSheetProps {
  visible: boolean
  onClose: () => void
  authorName?: string
}

function ShareOption({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  onPress: () => void
}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <XStack
        alignItems="center"
        gap={14}
        paddingVertical={14}
        paddingHorizontal={4}
        borderBottomWidth={1}
        borderBottomColor="rgba(85,85,85,0.6)"
      >
        <XStack
          width={42}
          height={42}
          borderRadius={21}
          backgroundColor="#2e2e2e"
          borderWidth={1}
          borderColor="#555555"
          alignItems="center"
          justifyContent="center"
        >
          <Ionicons name={icon} size={20} color={eliteForgeColors.emerald} />
        </XStack>
        <Text color="#FFFFFF" fontSize={15} fontWeight="600" flex={1}>
          {label}
        </Text>
        <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.35)" />
      </XStack>
    </Pressable>
  )
}

export function FeedShareSheet({ visible, onClose, authorName }: FeedShareSheetProps) {
  const { insets } = useResponsiveLayout()

  const handleOption = () => {
    onClose()
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />

        <YStack
          backgroundColor="#363636"
          borderTopLeftRadius={20}
          borderTopRightRadius={20}
          borderWidth={1}
          borderColor="#555555"
          paddingHorizontal={16}
          paddingTop={10}
          paddingBottom={insets.bottom + 16}
        >
          <XStack alignSelf="center" width={40} height={4} borderRadius={2} backgroundColor="#666666" marginBottom={12} />

          <Text color="#FFFFFF" fontWeight="800" fontSize={17} marginBottom={4}>
            {translate("feedScreen:shareTitle")}
          </Text>
          {authorName ? (
            <Text color="rgba(255,255,255,0.5)" fontSize={13} marginBottom={8}>
              {translate("feedScreen:shareFrom", { name: authorName })}
            </Text>
          ) : null}

          <ShareOption
            icon="link-outline"
            label={translate("feedScreen:shareCopyLink")}
            onPress={handleOption}
          />
          <ShareOption
            icon="paper-plane-outline"
            label={translate("feedScreen:shareSendFriends")}
            onPress={handleOption}
          />
          <ShareOption
            icon="share-social-outline"
            label={translate("feedScreen:shareExternal")}
            onPress={handleOption}
          />

          <Pressable onPress={onClose} accessibilityRole="button">
            <XStack
              marginTop={14}
              borderRadius={12}
              backgroundColor="#2e2e2e"
              borderWidth={1}
              borderColor="#555555"
              alignItems="center"
              justifyContent="center"
              paddingVertical={14}
            >
              <Text color="#FFFFFF" fontWeight="700" fontSize={15}>
                {translate("feedScreen:composeCancel")}
              </Text>
            </XStack>
          </Pressable>
        </YStack>
      </View>
    </Modal>
  )
}
