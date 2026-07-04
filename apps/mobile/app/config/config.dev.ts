/**
 * These are configuration settings for the dev environment.
 *
 * Do not include API secrets in this file or anywhere in your JS.
 *
 * https://reactnative.dev/docs/security#storing-sensitive-info
 */
import { Platform } from "react-native"

/** Android emulator maps host localhost to 10.0.2.2 */
const API_HOST = Platform.OS === "android" ? "10.0.2.2" : "localhost"

export default {
  API_URL: `http://${API_HOST}:3000/api/`,
}
