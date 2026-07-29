const path = require("path")

/**
 * Ensures RN CLI / Expo autolinking resolve packages from the npm workspace
 * root (hoisted node_modules), not a non-existent apps/mobile/node_modules tree.
 */
module.exports = {
  project: {
    ios: {},
    android: {
      sourceDir: "./android",
    },
  },
  // Keep dependency discovery rooted at this workspace package.
  reactNativePath: path.dirname(
    require.resolve("react-native/package.json", { paths: [__dirname] }),
  ),
}
