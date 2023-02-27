import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    evm: 'evm/index.ts',
  },
  format: ['esm', 'cjs'],
  // FIXME not sure why core will be bundled if not specify explicitly
  external: ['@pancakeswap/swap-sdk-core'],
  dts: true,
})
