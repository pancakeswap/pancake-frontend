import { datadogLogs, Logger, LogsInitConfiguration } from '@datadog/browser-logs'
// TODO: move to env if needed
const DATA_DOG_SITE_US = 'us3.datadoghq.com'

export class DataDogBrowserLogger {
  private readonly site: string

  constructor(site: string) {
    this.site = site
    this.init()
  }

  private init(): void {
    try {
      datadogLogs.init({
        clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN || '',
        env: process.env.NEXT_PUBLIC_VERCEL_ENV,
        version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
        site: this.site,
        forwardErrorsToLogs: true,
        sessionSampleRate: 100,
        service: 'pancakeswap-web',
      })
    } catch (e) {
      console.error(e)
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private getLogger(name: string, config?: Partial<LogsInitConfiguration>): Logger {
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

  public getLoggerInstance(name: string, config?: Partial<LogsInitConfiguration>): Logger {
    return this.getLogger(name, config)
  }
}
export const logger = new DataDogBrowserLogger(DATA_DOG_SITE_US).getLoggerInstance('main')
