import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'
import { withAxiom } from 'next-axiom'

const withVanillaExtract = createVanillaExtractPlugin()

const blocksPage = process.env.NODE_ENV === 'production' ? [] : []

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
      ...blocksPage.map((p) => ({
        source: p,
        destination: '/404',
        permanent: false,
      })),
    ]
  },
}

export default withAxiom(withVanillaExtract(nextConfig))
