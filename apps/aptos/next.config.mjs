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
  '@pancakeswap/farms',
])

const blocksPage =
  process.env.NODE_ENV === 'production'
    ? ['/farms', '/farms/history', '/ifo', '/ifo/history', '/pools', '/pools/history']
    : []

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
      ...blocksPage.map((p) => ({
        source: p,
        destination: '/404',
        permanent: false,
      })),
    ]
  },
}

export default withBundleAnalyzer(withVanillaExtract(withTH(withAxiom(nextConfig))))
