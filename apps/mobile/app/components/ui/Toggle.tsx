import { Label, Switch, type SwitchProps, XStack, YStack } from "tamagui"

export interface AppToggleProps extends SwitchProps {
  label?: string
  description?: string
}

export function Toggle({ label, description, id, ...props }: AppToggleProps) {
  const switchId = id ?? label?.toLowerCase().replace(/\s+/g, "-")

  return (
    <XStack alignItems="center" justifyContent="space-between" gap="$3" py="$2">
      <YStack flex={1} gap="$1">
        {label ? (
          <Label htmlFor={switchId} fontSize="$4" fontWeight="600">
            {label}
          </Label>
        ) : null}
        {description ? (
          <Label htmlFor={switchId} fontSize="$2" color="$gray10">
            {description}
          </Label>
        ) : null}
      </YStack>
      <Switch id={switchId} size="$3" bg={props.checked ? "$blue10" : "$gray6"} {...props}>
        <Switch.Thumb />
      </Switch>
    </XStack>
  )
}
