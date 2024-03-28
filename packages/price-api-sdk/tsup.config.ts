import { defineConfig } from 'tsup'
import { exec } from 'child_process'

export default defineConfig((options) => ({
  entry: {
    index: './src/index.ts',
  },
  sourcemap: true,
  skipNodeModulesBundle: true,
  format: ['esm', 'cjs'],
  noExternal: ['@pancakeswap/utils'],
  dts: true,
  clean: !options.watch,
  treeshake: true,
  splitting: true,
}))
