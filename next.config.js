/* eslint-disable @typescript-eslint/no-var-requires */
const { withSentryConfig } = require('@sentry/nextjs')
const { withAxiom } = require('next-axiom')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withTM = require('next-transpile-modules')(['@pancakeswap/uikit', '@pancakeswap/sdk'])

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
        // For all available options, see:
        // https://github.com/getsentry/sentry-webpack-plugin#options.
      }
    : {
        silent: true, // Suppresses all logs
        dryRun: !process.env.SENTRY_AUTH_TOKEN,
      }

/** @type {import('next').NextConfig} */
const config = {
  compiler: {
    styledComponents: true,
  },
  experimental: {
    scrollRestoration: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static-nft.pancakeswap.com',
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
      {
        source: '/info/pair/:address',
        destination: '/info/pools/:address',
      },
    ]
  },
  async headers() {
    return [
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
    ]
  },
  webpack: (webpackConfig, { webpack }) => {
    // tree shake sentry tracing
    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: false,
        __SENTRY_TRACING__: false,
      }),
    )
    return webpackConfig
  },
}

module.exports = withBundleAnalyzer(
  withVanillaExtract(withSentryConfig(withTM(withAxiom(config)), sentryWebpackPluginOptions)),
)
