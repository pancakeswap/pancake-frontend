import bundleAnalyzer from '@next/bundle-analyzer'

import { withWebSecurityHeaders } from '@pancakeswap/next-config/withWebSecurityHeaders'
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'

const withVanillaExtract = createVanillaExtractPlugin()
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  transpilePackages: [
    '@pancakeswap/localization',
    '@pancakeswap/hooks',
    '@pancakeswap/utils',
    '@pancakeswap/tokens',
    '@pancakeswap/farms',
    '@pancakeswap/widgets-internal',
  ],
  experimental: {
    optimizePackageImports: ['@pancakeswap/widgets-internal', '@pancakeswap/uikit'],
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

export default withBundleAnalyzer(withVanillaExtract(withWebSecurityHeaders(nextConfig)))
