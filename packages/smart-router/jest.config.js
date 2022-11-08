// eslint-disable-next-line no-undef
module.exports = {
  roots: ['evm'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx|js|jsx)'],
  verbose: false,
  clearMocks: true,
  resetModules: true,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__fixtures__/',
    '/__tests__/',
    '/(__)?mock(s__)?/',
    '/__jest__/',
    '.?.min.js',
  ],
  coverageDirectory: '../coverage/',
  coverageReporters: ['json-summary', 'text', 'lcov'],
  moduleDirectories: ['node_modules', 'src'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts'],
}
