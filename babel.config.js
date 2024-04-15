module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      require.resolve("babel-plugin-module-resolver"),
      {
        cwd: "babelrc",
        extensions: [".ts", ".tsx", ".js", ".ios.js", ".android.js"],
        alias: {
          "@assets": "./src/assets",
          "@theme": "./src/theme",
          "@constants": "./src/assets/constants",
          "@images": "./src/assets/images",
          "@components": "./src/components",
          "@screens": "./src/screens",
          "@config": "./src/config",
          "@utils": "./src/utils",
          "@network": "./src/network",
          "@app-hooks": "./src/app-hooks",
          "@store": "./src/store",
        },
      },
    ],
    "jest-hoist",
    "react-native-reanimated/plugin",
  ],
};
