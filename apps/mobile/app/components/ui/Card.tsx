import { Card as TamaguiCard, type CardProps, Text, YStack } from "tamagui"

export interface AppCardProps extends CardProps {
  title?: string
  subtitle?: string
}

export function Card({ title, subtitle, children, ...props }: AppCardProps) {
  return (
    <TamaguiCard
      borderWidth={1}
      rounded="$4"
      p="$4"
      bg="$background"
      elevation="$2"
      {...props}
    >
      <YStack gap="$2">
        {title ? (
          <Text fontSize="$6" fontWeight="700" color="$color">
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text fontSize="$3" color="$gray10">
            {subtitle}
          </Text>
        ) : null}
        {children}
      </YStack>
    </TamaguiCard>
  )
}
