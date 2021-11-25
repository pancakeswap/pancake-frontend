import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import envCompatible from 'vite-plugin-env-compatible'
import tsconfigPaths from 'vite-tsconfig-paths'
import legacy from '@vitejs/plugin-legacy'

const htmlPlugin = (env) => {
  return {
    name: 'html-transform',
    transformIndexHtml: (html: string) => {
      return html.replace(/%(.*?)%/g, (match, p1) => {
        return env[p1]
      })
    },
  }
}

const COMPATIBLE_ENV_PREFIX = 'REACT_APP'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, 'env', COMPATIBLE_ENV_PREFIX)

  return {
    build: {
      outDir: 'build',
      assetsDir: 'static',
    },
    resolve: {
      alias: [
        // remove after module path is fixed https://github.com/binance-chain-npm/bsc-web3-connector/pull/1
        {
          find: '@binance-chain/bsc-connector',
          replacement: path.resolve(__dirname, 'node_modules/@binance-chain/bsc-connector/dist/bsc-connector.esm.js'),
        },
      ],
    },
    optimizeDeps: {
      // for local linking purpose.
      exclude: ['@pancakeswap/uikit'],
    },
    plugins: [
      tsconfigPaths(),
      envCompatible({
        prefix: COMPATIBLE_ENV_PREFIX,
      }),
      htmlPlugin(env),
      react(),
      // Polyfill support for legacy browsers. It should automatically detects `browserslist`
      legacy(),
    ],
  }
})
