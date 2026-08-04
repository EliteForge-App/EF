import { Alert } from "react-native"

import { translate } from "@/i18n/translate"

export type FeedDestination = "profile" | "groups" | "matches" | "reservations"

/**
 * Placeholder de navegación del Feed hasta que existan las pantallas reales.
 */
export function showFeedComingSoon(destination: FeedDestination) {
  Alert.alert(
    translate("feedDrawer:comingSoonTitle"),
    translate(`feedDrawer:${destination}Soon` as never),
  )
}

