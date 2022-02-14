// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

const isUserRejected = (err) => {
  // provider user rejected error code
  return typeof err === 'object' && 'code' in err && err.code === 4001
}

Sentry.init({
  dsn: SENTRY_DSN || 'https://ed98e16b9d704c22bef92d24bdd5f3b7@o1092725.ingest.sentry.io/6111410',
  integrations: [
    new Sentry.Integrations.Breadcrumbs({
      console: process.env.NODE_ENV === 'production',
    }),
    new Sentry.Integrations.GlobalHandlers({
      onerror: false,
      onunhandledrejection: false,
    }),
  ],
  environment: process.env.NODE_ENV,
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
  beforeSend(event, hint) {
    const error = hint?.originalException
    if (error && isUserRejected(error)) {
      return null
    }
    return event
  },
  ignoreErrors: [
    'User denied transaction signature',
    'Non-Error promise rejection captured',
    'User rejected the transaction',
    'cancelled',
  ],
})
