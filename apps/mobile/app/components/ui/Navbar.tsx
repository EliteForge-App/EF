import { XStack, type XStackProps } from "tamagui"

import { EliteForgeLogo } from "./Logo"

export interface NavbarProps extends XStackProps {
  rightContent?: React.ReactNode
  showLogo?: boolean
}

export function Navbar({ rightContent, showLogo = true, children, ...props }: NavbarProps) {
  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      px="$4"
      py="$3"
      bg="$background"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
      {...props}
    >
      <XStack alignItems="center" gap="$3" flex={1}>
        {showLogo ? <EliteForgeLogo width={36} /> : null}
        {children}
      </XStack>
      {rightContent}
    </XStack>
  )
}
