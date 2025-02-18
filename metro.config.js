const { withNativeWind } = require("nativewind/metro");
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const { withSentryConfig } = require("@sentry/react-native/metro");

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = mergeConfig(getDefaultConfig(__dirname), {
  cacheVersion: process.env.NODE_ENV,
});

module.exports = withSentryConfig(withNativeWind(config), {
  input: "./global.css",
  inlineRem: 16,
});
