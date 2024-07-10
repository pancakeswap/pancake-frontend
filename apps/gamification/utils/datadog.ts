import { datadogLogs, LogsInitConfiguration } from '@datadog/browser-logs'
import { datadogRum as ddRum } from '@datadog/browser-rum'

try {
  datadogLogs.init({
    clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN || '',
    env: process.env.NEXT_PUBLIC_VERCEL_ENV,
    version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    site: process.env.NEXT_PUBLIC_DD_RUM_SITE || '',
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

export const tracker = getLogger('perf', { forwardErrorsToLogs: false })

function createDatadogRumManager() {
  let initialized = false

  function init() {
    if (initialized) {
      return
    }
    const env = process.env.NEXT_PUBLIC_VERCEL_ENV
    const sessionSampleRate = env === 'production' ? 1 : env === 'preview' ? 100 : 0
    ddRum.init({
      version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
      enableExperimentalFeatures: ['feature_flags'],
      applicationId: process.env.NEXT_PUBLIC_DD_RUM_APP_ID || '',
      clientToken: process.env.NEXT_PUBLIC_DD_RUM_CLIENT_TOKEN || '',
      site: process.env.NEXT_PUBLIC_DD_RUM_SITE || '',
      service: 'pancakeswap-web',
      env,
      sessionSampleRate,
      sessionReplaySampleRate: 10,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask-user-input',
    })
    initialized = true
  }

  const setUser: typeof ddRum.setUser = (...args) => {
    if (!initialized) {
      return
    }
    ddRum.setUser(...args)
  }

  const setUserProperty: typeof ddRum.setUserProperty = (...args) => {
    if (!initialized) {
      return
    }
    ddRum.setUserProperty(...args)
  }

  const clearUser: typeof ddRum.clearUser = (...args) => {
    if (!initialized) {
      return
    }
    try {
      ddRum.clearUser(...args)
    } catch (error) {
      //
    }
  }

  const setGlobalContextProperty: typeof ddRum.setGlobalContextProperty = (...args) => {
    if (!initialized) {
      return
    }
    ddRum.setGlobalContextProperty(...args)
  }

  const removeGlobalContextProperty: typeof ddRum.removeGlobalContextProperty = (...args) => {
    if (!initialized) {
      return
    }
    ddRum.removeGlobalContextProperty(...args)
  }

  const addFeatureFlagEvaluation: typeof ddRum.addFeatureFlagEvaluation = (...args) => {
    if (!initialized) {
      return
    }
    ddRum.addFeatureFlagEvaluation(...args)
  }

  return {
    initialized,
    init,
    setUser,
    clearUser,
    setUserProperty,
    addFeatureFlagEvaluation,
    setGlobalContextProperty,
    removeGlobalContextProperty,
  }
}

export const datadogRum = createDatadogRumManager()
