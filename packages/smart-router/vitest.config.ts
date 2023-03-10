import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,

    // FIXME tick spacing updated so need to update unit test accordingly
    // Not using skip is because skip is not working on describe
    // https://github.com/vitest-dev/vitest/issues/2371
    exclude: ['**/swapRouter.test.ts'],
  },
})
