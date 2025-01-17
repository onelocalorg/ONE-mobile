const { withNativeWind } = require('nativewind/metro');
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const {
 withSentryConfig
} = require("@sentry/react-native/metro");

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = mergeConfig(getDefaultConfig(__dirname), {
  cacheVersion: process.env.NODE_ENV,
});

module.exports = withNativeWind(withSentryConfig(config), 
  { input: './global.css', inlineRem: 16 });