import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'
import { withAxiom } from 'next-axiom'
import { withWebSecurityHeaders } from '@pancakeswap/next-config/withWebSecurityHeaders'

const withVanillaExtract = createVanillaExtractPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    '@pancakeswap/uikit',
    '@pancakeswap/hooks',
    '@pancakeswap/localization',
    '@pancakeswap/utils',
    '@pancakeswap/games',
    '@pancakeswap/blog',
  ],
  images: {
    contentDispositionType: 'attachment',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.pancakeswap.finance',
        pathname: '/web/**',
      },
    ],
  },
  compiler: {
    styledComponents: true,
  },
}

export default withAxiom(withVanillaExtract(withWebSecurityHeaders(nextConfig)))
