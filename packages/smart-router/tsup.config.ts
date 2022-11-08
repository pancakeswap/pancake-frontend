import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    evm: 'evm/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
})
