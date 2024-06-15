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
  root: true,
  rules: {
    // "@typescript-eslint/no-unused-vars": "warn",
    // "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unsafe-assignment": "warn",
  },
  overrides: [
    {
      // To fix warning in the .eslintrc.cjs file
      extends: ["plugin:@typescript-eslint/disable-type-checked"],
      files: [".eslintrc.cjs"],
    },
  ],
};
