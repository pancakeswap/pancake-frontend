import transpileModules from 'next-transpile-modules'

const withTH = transpileModules(['@pancakeswap/uikit'])

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/transfer',
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

export default withTH(nextConfig)
