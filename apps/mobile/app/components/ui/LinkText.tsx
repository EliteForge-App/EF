import { Pressable } from "react-native"
import { Text, XStack } from "tamagui"

export interface LinkTextProps {
  prompt: string
  linkLabel: string
  onPress: () => void
  /** Alineación del bloque (login: derecha de los sociales) */
  align?: "center" | "flex-end" | "flex-start"
}

export function LinkText({
  prompt,
  linkLabel,
  onPress,
  align = "center",
}: LinkTextProps) {
  return (
    <XStack
      justifyContent={align}
      alignItems="center"
      gap={4}
      flexWrap="wrap"
      maxWidth="100%"
    >
      <Text color="$efWhite" opacity={0.7} fontSize={13} numberOfLines={1}>
        {prompt}
      </Text>
      <Pressable onPress={onPress} hitSlop={8}>
        <Text
          color="$efOrange"
          fontSize={13}
          fontWeight="700"
          textDecorationLine="underline"
          numberOfLines={1}
        >
          {linkLabel}
        </Text>
      </Pressable>
    </XStack>
  )
}
