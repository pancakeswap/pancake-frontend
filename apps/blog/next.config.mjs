import { withWebSecurityHeaders } from '@pancakeswap/next-config/withWebSecurityHeaders'
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'

const withVanillaExtract = createVanillaExtractPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@pancakeswap/uikit', '@pancakeswap/hooks', '@pancakeswap/localization', '@pancakeswap/utils'],
  compiler: {
    styledComponents: true,
  },
}

export default withVanillaExtract(withWebSecurityHeaders(nextConfig))
