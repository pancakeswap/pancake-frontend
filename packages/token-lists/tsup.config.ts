import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: './src/index.ts',
    react: './react/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
})
