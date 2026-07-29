import { Text, XStack } from "tamagui"

export interface DividerProps {
  label: string
}

export function Divider({ label }: DividerProps) {
  return (
    <XStack alignItems="center" gap="$3" my="$2">
      <XStack flex={1} height={1} bg="$efCarbonBorder" />
      <Text color="$efWhite" opacity={0.5} fontSize="$2" fontWeight="500">
        {label}
      </Text>
      <XStack flex={1} height={1} bg="$efCarbonBorder" />
    </XStack>
  )
}
