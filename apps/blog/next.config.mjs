import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'
import { withAxiom } from 'next-axiom'

const withVanillaExtract = createVanillaExtractPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    transpilePackages: [
      '@pancakeswap/uikit',
      '@pancakeswap/ui',
      '@pancakeswap/hooks',
      '@pancakeswap/localization',
      '@pancakeswap/utils',
    ],
  },
  compiler: {
    styledComponents: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/blog',
        permanent: false,
      },
    ]
  },
  publicRuntimeConfig: {
    STRAPI_API_URL: process.env.STRAPI_API_URL
  }
}

export default withAxiom(withVanillaExtract(nextConfig))
