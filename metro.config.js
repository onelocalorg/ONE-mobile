const { withNativeWind } = require("nativewind/metro");
const { withSentryConfig } = require("@sentry/react-native/metro");
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

/**
 * Metro configuration
 * https://metrobundler.dev/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

module.exports = withSentryConfig(
  withNativeWind(mergeConfig(getDefaultConfig(__dirname), config), {
    input: "./global.css",
    inlineRem: 16,
  })
);
