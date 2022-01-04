// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextJest = require('next/jest')

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({ dir: './' })

// Any custom config you want to pass to Jest
const customJestConfig = {
  testPathIgnorePatterns: ['<rootDir>/cypress/', '<rootDir>/src/__tests__/config'],
  moduleDirectories: ['node_modules', 'src'],
  testTimeout: 20000,
}

// createJestConfig is exported in this way to ensure that next/jest can load the Next.js configuration, which is async
module.exports = createJestConfig(customJestConfig)
