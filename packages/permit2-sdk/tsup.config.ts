import { exec } from 'child_process'
import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  entry: {
    index: './src/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: false,
  clean: !options.watch,
  treeshake: true,
  splitting: true,
  onSuccess: async () => {
    exec('tsc --emitDeclarationOnly --declaration', (err) => {
      if (err) {
        console.error(err)
        if (!options.watch) {
          process.exit(1)
        }
      }
    })
  },
}))
