import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  external: ['@epic-web/invariant'],
  treeshake: true,
  splitting: true,
})
