import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    core: 'core/src/index.ts',
    index: 'src/index.ts',
    'connectors/martian': 'core/src/connectors/martian.ts',
    'connectors/blocto': 'core/src/connectors/blocto.ts',
    'connectors/petra': 'core/src/connectors/petra.ts',
    'connectors/fewcha': 'core/src/connectors/fewcha.ts',
    'connectors/pontem': 'core/src/connectors/pontem.ts',
    'connectors/safePal': 'core/src/connectors/safePal.ts',
    'connectors/rise': 'core/src/connectors/rise.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  treeshake: true,
  splitting: true,
})
