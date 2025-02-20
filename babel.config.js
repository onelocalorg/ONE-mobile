module.exports = function (api) {
  api.cache(false);
  return {
    presets: ["module:@react-native/babel-preset", "nativewind/babel"],
    plugins: [
      "jest-hoist",
      [
        "babel-plugin-root-import",
        {
          rootPathPrefix: "~/",
          rootPathSuffix: "src",
        },
      ],
      ["module:react-native-dotenv"],
      "react-native-reanimated/plugin", // Must be last
    ],
  };
};
