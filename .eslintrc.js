module.exports = {
  extends: ["eslint:recommended", "@react-native-community", "plugin:prettier/recommended"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/no-shadow": ["off"],
        "no-shadow": "off",
        "no-undef": "off",
      },
    },
  ],
  rules: {
    "react-native/no-inline-styles": [0],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [0],
    "react-hooks/exhaustive-deps": [0],
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
  settings: {
    "import/resolver": {
      "babel-module": {allowExistingDirectories: true},
    },
  },
};
