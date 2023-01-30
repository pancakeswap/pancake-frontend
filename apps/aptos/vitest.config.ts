import { defineConfig } from 'vitest/config'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  // @ts-ignore
  plugins: [tsconfigPaths(), react(), vanillaExtractPlugin()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
