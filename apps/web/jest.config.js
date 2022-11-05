// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextJest = require('next/jest')

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({ dir: './' })

// Any custom config you want to pass to Jest
const customJestConfig = {
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': ['babel-jest', { configFile: './babel-test.config.json' }],
  },
  testPathIgnorePatterns: ['<rootDir>/src/config/__tests__/'],
  moduleNameMapper: {
    '^@pancakeswap/uikit': '<rootDir>/../../packages/uikit/src',
    '^@pancakeswap/ui-wallets': '<rootDir>../../packages/ui-wallets/src',
    '^@pancakeswap/ui/(.*)$': '<rootDir>../../packages/ui/$1',
    '^@pancakeswap/ui': '<rootDir>../../packages/ui',
    '^@pancakeswap/swap-sdk-core': '<rootDir>../../packages/swap-sdk-core/src',
    '^@pancakeswap/sdk': '<rootDir>../..//packages/swap-sdk/src',
    '^@pancakeswap/localization': ['<rootDir>../../packages/localization/src'],
    '^@pancakeswap/hooks': ['<rootDir>../../packages/hooks/src'],
    '^@pancakeswap/wagmi/chains': ['<rootDir>../../packages/wagmi/chains'],
    '^@pancakeswap/wagmi/connectors/blocto': ['<rootDir>../../packages/wagmi/connectors/blocto'],
    '^@pancakeswap/wagmi/connectors/miniProgram': ['<rootDir>../../packages/wagmi/connectors/miniProgram'],
    '^@pancakeswap/wagmi/connectors/binanceWallet': ['<rootDir>../../packages/wagmi/connectors/binanceWallet'],
    '^@pancakeswap/wagmi': ['<rootDir>../../packages/wagmi/src'],
  },
  moduleDirectories: ['node_modules', 'src'],
  testTimeout: 20000,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
}

// createJestConfig is exported in this way to ensure that next/jest can load the Next.js configuration, which is async
const jestConfig = createJestConfig(customJestConfig)

module.exports = jestConfig().then((config) => {
  // Remove default css mock
  // eslint-disable-next-line no-param-reassign
  delete config.moduleNameMapper['^.+\\.(css|sass|scss)$']
  return config
})
