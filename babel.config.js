module.exports = function (api) {
  api.cache(false);
  return {
    presets: ["module:metro-react-native-babel-preset"],
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
      "react-native-reanimated/plugin",
    ],
  };
};
