/* eslint-env node */
module.exports = {
  env: {
    "react-native/react-native": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@tanstack/eslint-plugin-query/recommended",
    // "plugin:@typescript-eslint/strict-type-checked",
    "plugin:react-hooks/recommended",
    // "plugin:@typescript-eslint/stylistic-type-checked",
    "prettier",
  ],
  plugins: ["react", "react-native", "@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: [
    "node_modules",
    "ios",
    "android",
    "babel.config.js",
    "metro.config.js",
    "tailwind.config.js",
    "__tests__",
    "jest.config.js",
    "react-native.config.js",
    "src/components/ui/**",
  ],
  root: true,
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-return": "warn",
    "@typescript-eslint/no-misused-promises": "warn",
    "@typescript-eslint/no-floating-promises": "warn",
  },
  overrides: [
    {
      // To fix warning in the .eslintrc.cjs file
      extends: ["plugin:@typescript-eslint/disable-type-checked"],
      files: [".eslintrc.cjs"],
    },
  ],
};
