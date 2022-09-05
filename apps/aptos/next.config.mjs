import transpileModules from 'next-transpile-modules'
import { withAxiom } from 'next-axiom'

const withTH = transpileModules(['@pancakeswap/uikit', '@pancakeswap/sdk'])

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

export default withTH(withAxiom(nextConfig))
