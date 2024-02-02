import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

const r = (p: string) => resolve(__dirname, p)

export default defineConfig({
  resolve: {
    alias: {
      '@pancakeswap/awgmi/core': r('./core/src/index.ts'),
    },
  },
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    environment: 'happy-dom',
    setupFiles: ['./core/test/setup.ts'],
  },
})
