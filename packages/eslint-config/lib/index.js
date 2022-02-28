module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2017,
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    es6: true,
    browser: true,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".ts", ".jsx", ".tsx"],
      },
    },
    "import/extensions": [".js", ".ts", ".jsx", ".tsx"],
  },
  extends: [
    "airbnb",
    "airbnb/hooks",
    "prettier",
    "prettier/react",
    "prettier/@typescript-eslint",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    // Typescript
    "@typescript-eslint/no-unused-vars": "warn",
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["warn"],
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],
    "no-console": ["warn", { allow: ["info", "warn", "error"] }],
    "no-plusplus": 0,
    "prefer-destructuring": ["warn", { object: true, array: false }],
    "no-underscore-dangle": 0,
    // React
    "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
    "react/prop-types": 0,
    "react/jsx-props-no-spreading": 0,
    "react/no-multi-comp": 0,
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        mjs: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
  },
};
