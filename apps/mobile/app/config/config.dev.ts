/**
 * These are configuration settings for the dev environment.
 *
 * Do not include API secrets in this file or anywhere in your JS.
 *
 * https://reactnative.dev/docs/security#storing-sensitive-info
 */
import Constants from "expo-constants"
import { Platform } from "react-native"

/** LAN IP de tu PC en WiFi — actualízala si cambias de red */
const DEV_LAN_HOST = "192.168.1.148"

function getDevApiHost(): string {
  if (Platform.OS === "web") return "localhost"
  if (!Constants.isDevice) {
    return Platform.OS === "android" ? "10.0.2.2" : "localhost"
  }
  return DEV_LAN_HOST
}

export default {
  API_URL: `http://${getDevApiHost()}:3000/api/`,
  /** Portal web de registro (apps/web en dev) */
  SIGN_UP_URL: "http://localhost:5173/auth/sign-up",
}
