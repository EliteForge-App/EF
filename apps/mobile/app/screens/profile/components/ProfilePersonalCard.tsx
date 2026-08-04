import { Text, YStack } from "tamagui"

import { translate } from "@/i18n/translate"
import { eliteForgeColors } from "@/theme/eliteForgeColors"

export interface ProfilePersonalCardProps {
  age?: string
  bio?: string
}

export function ProfilePersonalCard({ age, bio }: ProfilePersonalCardProps) {
  if (!age && !bio) return null

  return (
    <YStack
      borderRadius={16}
      borderWidth={1}
      borderColor={eliteForgeColors.carbonBorder}
      backgroundColor={eliteForgeColors.carbonElevated}
      padding={16}
      gap={10}
    >
      <Text color={eliteForgeColors.white} fontWeight="800" fontSize={17}>
        {translate("profileScreen:personalInfoTitle")}
      </Text>
      {age ? (
        <Text color="rgba(255,255,255,0.65)" fontSize={13}>
          {translate("profileScreen:personalAge", { age })}
        </Text>
      ) : null}
      {bio ? (
        <Text color="rgba(255,255,255,0.65)" fontSize={13} lineHeight={20}>
          {bio}
        </Text>
      ) : null}
    </YStack>
  )
}
