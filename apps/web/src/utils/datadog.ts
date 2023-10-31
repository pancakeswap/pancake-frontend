import { datadogLogs, LogsInitConfiguration } from '@datadog/browser-logs'

// TODO: move to env if needed
const DATA_DOG_SITE = 'us3.datadoghq.com'

try {
  datadogLogs.init({
    clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN || '',
    env: process.env.NEXT_PUBLIC_VERCEL_ENV,
    version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    site: DATA_DOG_SITE,
    forwardErrorsToLogs: true,
    sessionSampleRate: 100,
    service: 'pancakeswap-web',
  })
} catch (e) {
  console.error(e)
}

export function getLogger(name: string, config?: Partial<LogsInitConfiguration>) {
  const logger = datadogLogs.getLogger(name)
  if (logger) {
    return logger
  }
  return datadogLogs.createLogger(name, {
    handler: process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 'http' : ['console', 'http'],
    context: {
      service: `pancakeswap-web-${name}`,
      ...config,
    },
  })
}

export const logger = getLogger('main')
