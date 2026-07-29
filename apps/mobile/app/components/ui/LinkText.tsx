import { Pressable } from "react-native"
import { Text, XStack } from "tamagui"

export interface LinkTextProps {
  prompt: string
  linkLabel: string
  onPress: () => void
}

export function LinkText({ prompt, linkLabel, onPress }: LinkTextProps) {
  return (
    <XStack justifyContent="center" alignItems="center" gap="$1" flexWrap="wrap">
      <Text color="$efWhite" opacity={0.7} fontSize="$3">
        {prompt}
      </Text>
      <Pressable onPress={onPress} hitSlop={8}>
        <Text color="$efOrange" fontSize="$3" fontWeight="700" textDecorationLine="underline">
          {linkLabel}
        </Text>
      </Pressable>
    </XStack>
  )
}
