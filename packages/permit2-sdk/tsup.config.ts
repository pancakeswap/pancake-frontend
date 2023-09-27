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
  //   onSuccess: async () => {
  //     exec('tsc --emitDeclarationOnly --declaration', (err, stdout) => {
  //       if (err) {
  //         console.error(err)
  //         if (!options.watch) {
  //           process.exit(1)
  //         }
  //       }
  //     })
  //   },
}))
