import { mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import defaultConfig from './vitest.config'

export default mergeConfig(
  defaultConfig,
  defineConfig({
    test: {
      include: ['src/config/__tests__/**'],
    },
  }),
)
