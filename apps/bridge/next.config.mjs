import transpileModules from 'next-transpile-modules'
import { withAxiom } from 'next-axiom'
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'

const withVanillaExtract = createVanillaExtractPlugin()
const withTH = transpileModules(['@pancakeswap/uikit', '@pancakeswap/wagmi', '@pancakeswap/sdk', '@pancakeswap/ui'])

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
}

export default withTH(withAxiom(withVanillaExtract(nextConfig)))
