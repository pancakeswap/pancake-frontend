export default {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  collectCoverageFrom: [
    "**/*.ts",
    "!./src/index.ts",
    "!**/node_modules/**",
    "!**/dist/**",
  ],
};
