import defaultConfig from './vitest.config'

export default {
  ...defaultConfig,
  test: {
    setupFiles: ['./vitest.setup.js'],
    environment: 'jsdom',
    globals: true,
    include: ['src/config/__tests__/**'],
  },
}
