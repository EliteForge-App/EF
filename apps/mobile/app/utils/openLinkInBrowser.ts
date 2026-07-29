import { Linking } from "react-native"

/**
 * Opens a URL in an external browser.
 * On some Android builds `canOpenURL` is unreliable for http(s); always attempt openURL.
 */
export function openLinkInBrowser(url: string) {
  Linking.openURL(url).catch((error) => {
    console.warn("[openLinkInBrowser] No se pudo abrir:", url, error)
  })
}
