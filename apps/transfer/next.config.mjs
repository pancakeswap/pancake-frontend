import transpileModules from 'next-transpile-modules'

const withTH = transpileModules(['@pancakeswap/uikit'])

/** @type {import('next').NextConfig} */
const config = {
  basePath: '/transfer',
}

export default withTH(config)
