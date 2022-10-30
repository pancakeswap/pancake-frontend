// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { init } from '@sentry/nextjs'

const SENTRY_DSN = "https://8f767afc3f434a81b448537271cf46c8@o1309927.ingest.sentry.io/4504060841820160"
const ENV = process.env.VERCEL_ENV || process.env.NODE_ENV

init({
  dsn: SENTRY_DSN,
  environment: ENV === 'production' ? 'production' : 'development',
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
})
