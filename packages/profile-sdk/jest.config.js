module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  setupFilesAfterEnv: ["./jest.setup.js"],
  collectCoverageFrom: ["**/*.ts", "!./src/index.ts", "!**/node_modules/**", "!**/dist/**"],
};
