/* eslint-disable @typescript-eslint/no-var-requires */
import BundleAnalyzer from '@next/bundle-analyzer'
import { withWebSecurityHeaders } from '@pancakeswap/next-config/withWebSecurityHeaders'
import smartRouterPkgs from '@pancakeswap/smart-router/package.json' assert { type: 'json' }
import { withSentryConfig } from '@sentry/nextjs'
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const withVanillaExtract = createVanillaExtractPlugin()

const sentryWebpackPluginOptions =
  process.env.VERCEL_ENV === 'production'
    ? {
        // Additional config options for the Sentry Webpack plugin. Keep in mind that
        // the following options are set automatically, and overriding them is not
        // recommended:
        //   release, url, org, project, authToken, configFile, stripPrefix,
        //   urlPrefix, include, ignore
        silent: false, // Logging when deploying to check if there is any problem
        validate: true,
        hideSourceMaps: false,
        // https://github.com/getsentry/sentry-webpack-plugin#options.
      }
    : {
        hideSourceMaps: false,
        silent: true, // Suppresses all logs
        dryRun: !process.env.SENTRY_AUTH_TOKEN,
      }

const workerDeps = Object.keys(smartRouterPkgs.dependencies)
  .map((d) => d.replace('@pancakeswap/', 'packages/'))
  .concat(['/packages/smart-router/', '/packages/swap-sdk/', '/packages/token-lists/'])

/** @type {import('next').NextConfig} */
const config = {
  typescript: {
    tsconfigPath: 'tsconfig.build.json',
  },
  compiler: {
    styledComponents: true,
  },
  experimental: {
    scrollRestoration: true,
    fallbackNodePolyfills: false,
    outputFileTracingRoot: path.join(__dirname, '../../'),
    outputFileTracingExcludes: {
      '*': [],
    },
    optimizePackageImports: ['@pancakeswap/widgets-internal', '@pancakeswap/uikit'],
  },
  transpilePackages: [
    '@pancakeswap/farms',
    '@pancakeswap/position-managers',
    '@pancakeswap/localization',
    '@pancakeswap/hooks',
    '@pancakeswap/utils',
    '@pancakeswap/widgets-internal',
    '@pancakeswap/ifos',
  ],
  reactStrictMode: true,
  swcMinify: true,
  images: {
    contentDispositionType: 'attachment',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static-nft.pancakeswap.com',
        pathname: '/mainnet/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/info/token/:address',
        destination: '/info/tokens/:address',
      },
      {
        source: '/info/pool/:address',
        destination: '/info/pools/:address',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
      {
        source: '/logo.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
      {
        source: '/images/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
      {
        source: '/images/tokens/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=604800',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/send',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/swap/:outputCurrency',
        destination: '/swap?outputCurrency=:outputCurrency',
        permanent: true,
      },
      {
        source: '/create/:currency*',
        destination: '/add/:currency*',
        permanent: true,
      },
      {
        source: '/farms/archived',
        destination: '/farms/history',
        permanent: true,
      },
      {
        source: '/pool',
        destination: '/liquidity',
        permanent: true,
      },
      {
        source: '/staking',
        destination: '/pools',
        permanent: true,
      },
      {
        source: '/syrup',
        destination: '/pools',
        permanent: true,
      },
      {
        source: '/collectibles',
        destination: '/nfts',
        permanent: true,
      },
      {
        source: '/info/pools',
        destination: '/info/pairs',
        permanent: true,
      },
      {
        source: '/info/pools/:address',
        destination: '/info/pairs/:address',
        permanent: true,
      },
      {
        source: '/api/v3/:chainId/farms/liquidity/:address',
        destination: 'https://farms-api.pancakeswap.com/v3/:chainId/liquidity/:address',
        permanent: false,
      },
      {
        source: '/images/tokens/:address',
        destination: 'https://tokens.pancakeswap.finance/images/:address',
        permanent: false,
      },
      {
        source: '/trading-reward',
        destination: '/trading-reward/cake-stakers',
        permanent: true,
      },
    ]
  },
  webpack: (webpackConfig, { webpack, isServer }) => {
    // tree shake sentry tracing
    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: false,
        __SENTRY_TRACING__: false,
      }),
    )
    if (!isServer && webpackConfig.optimization.splitChunks) {
      // webpack doesn't understand worker deps on quote worker, so we need to manually add them
      // https://github.com/webpack/webpack/issues/16895
      // eslint-disable-next-line no-param-reassign
      webpackConfig.optimization.splitChunks.cacheGroups.workerChunks = {
        chunks: 'all',
        test(module) {
          const resource = module.nameForCondition?.() ?? ''
          return resource ? workerDeps.some((d) => resource.includes(d)) : false
        },
        priority: 31,
        name: 'worker-chunks',
        reuseExistingChunk: true,
      }
    }
    return webpackConfig
  },
}

export default withBundleAnalyzer(
  withVanillaExtract(withSentryConfig(withWebSecurityHeaders(config)), sentryWebpackPluginOptions),
)
