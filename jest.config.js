module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  setupFiles: ['<rootDir>/src/setupTests.js'],
  testPathIgnorePatterns: ['<rootDir>/cypress/', '<rootDir>/src/__tests__/config'],
  moduleDirectories: ['node_modules', 'src'],
  testTimeout: 20000,
  testEnvironment: 'jsdom',
}
