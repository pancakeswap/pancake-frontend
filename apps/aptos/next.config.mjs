import transpileModules from 'next-transpile-modules'
import bundleAnalyzer from '@next/bundle-analyzer'
import { withAxiom } from 'next-axiom'

import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'

const withVanillaExtract = createVanillaExtractPlugin()
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const withTH = transpileModules([
  '@pancakeswap/ui',
  '@pancakeswap/uikit',
  '@pancakeswap/localization',
  '@pancakeswap/hooks',
  '@pancakeswap/awgmi',
  '@pancakeswap/utils',
  '@pancakeswap/token-lists',
  '@pancakeswap/tokens',
])

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/swap',
        permanent: false,
      },
    ]
  },
}

export default withBundleAnalyzer(withVanillaExtract(withTH(withAxiom(nextConfig))))
