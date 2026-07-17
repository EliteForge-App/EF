/**
 * React Native 0.83 ships foojay-resolver-convention@0.5.0, incompatible with
 * Gradle 9 (IBM_SEMERU removed). Bump to 1.0.0 after each install.
 * @see https://github.com/facebook/react-native/issues/55781
 */
const fs = require("fs")
const path = require("path")

const target = path.join(
  __dirname,
  "../../../node_modules/@react-native/gradle-plugin/settings.gradle.kts",
)

if (!fs.existsSync(target)) {
  console.warn("[patch-rn-gradle-foojay] skip: file not found:", target)
  process.exit(0)
}

const before = fs.readFileSync(target, "utf8")
const after = before.replace(
  /id\("org\.gradle\.toolchains\.foojay-resolver-convention"\)\.version\("0\.5\.0"\)/,
  'id("org.gradle.toolchains.foojay-resolver-convention").version("1.0.0")',
)

if (before === after) {
  if (after.includes('version("1.0.0")')) {
    console.log("[patch-rn-gradle-foojay] already applied")
  } else {
    console.warn("[patch-rn-gradle-foojay] pattern not found; check RN version")
  }
  process.exit(0)
}

fs.writeFileSync(target, after)
console.log("[patch-rn-gradle-foojay] bumped foojay-resolver-convention to 1.0.0")
