import transpileModules from 'next-transpile-modules'
import { withAxiom } from 'next-axiom'

import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'

const withVanillaExtract = createVanillaExtractPlugin()

const withTH = transpileModules([
  '@pancakeswap/ui',
  '@pancakeswap/uikit',
  '@pancakeswap/aptos-swap-sdk',
  '@pancakeswap/localization',
  '@pancakeswap/hooks',
  '@pancakeswap/aptos',
  '@pancakeswap/utils',
])

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
}

export default withTH(withAxiom(withVanillaExtract(nextConfig)))
