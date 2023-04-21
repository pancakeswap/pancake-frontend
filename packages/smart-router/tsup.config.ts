import { defineConfig } from 'tsup'
import { exec } from 'child_process'

export default defineConfig((options) => ({
  entry: {
    evm: 'evm/index.ts',
  },
  format: ['esm', 'cjs'],
  // FIXME not sure why core will be bundled if not specify explicitly
  external: ['@pancakeswap/swap-sdk-core', 'jsbi'],
  dts: false,
  treeshake: true,
  splitting: true,
  clean: !options.watch,
  onSuccess: async () => {
    exec('tsc --emitDeclarationOnly --declaration', (err, stdout) => {
      if (err) {
        console.error(stdout)
        process.exit(1)
      }
    })
  },
}))
