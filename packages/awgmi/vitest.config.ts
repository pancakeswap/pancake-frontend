import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    environment: 'happy-dom',
    setupFiles: ['./core/test/setup.ts'],
  },
})
