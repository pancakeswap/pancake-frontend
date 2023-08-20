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
    '@pancakeswap/ui',
    '@pancakeswap/hooks',
    '@pancakeswap/localization',
    '@pancakeswap/utils',
    '@0xsquid/widget',
  ],
  compiler: {
    styledComponents: true,
  },
  async redirects() {
    return [
      {
        source: '/aptos',
        destination: '/stargate',
        permanent: true,
      },
    ]
  }
}

export default withAxiom(withVanillaExtract(withWebSecurityHeaders(nextConfig)))
