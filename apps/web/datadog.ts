import { datadogLogs, Logger, LogsInitConfiguration } from '@datadog/browser-logs'
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston'
import Transport from 'winston-transport'
import {
  DatadogPayload,
  datadogTransporter,
  httpTransportOptions,
  HttpTransportOptions,
} from './src/utils/datadogTransports'
// TODO: move to env if needed
const DATA_DOG_SITE_US = 'us3.datadoghq.com'
const { combine, timestamp, json, errors } = format

interface DDTransporter {
  payload: <T extends HttpTransportOptions>(payload: DatadogPayload<T>) => void
}

class CustomDatadogTransport extends Transport {
  private datadogTransporter: DDTransporter['payload']

  // eslint-disable-next-line @typescript-eslint/no-shadow
  constructor(datadogTransporter: DDTransporter['payload']) {
    super()
    this.datadogTransporter = datadogTransporter
  }

  log(payload: DDTransporter['payload'], cb: any) {
    this.datadogTransporter({ ...payload, ...httpTransportOptions })
    cb(null)
  }
}

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

export class WinstonServerLogger {
  public errorsFormat: any

  private datadogTransporter: DDTransporter['payload']

  // eslint-disable-next-line @typescript-eslint/no-shadow
  constructor(datadogTransporter: DDTransporter['payload']) {
    this.errorsFormat = errors({ stack: true })
    this.datadogTransporter = datadogTransporter
  }

  private getLogger(level: string) {
    // const { combine, timestamp, json } = this.format

    return createLogger({
      level,
      exitOnError: false,
      format: combine(timestamp(), json(), this.errorsFormat),
      transports: [
        new transports.Console({
          format: combine(timestamp(), json(), this.errorsFormat),
        }),

        new transports.File({
          filename: '/Users/evan/Documents/logs_datadog/app.log',
          format: combine(timestamp(), json(), this.errorsFormat),
        }),

        new CustomDatadogTransport(this.datadogTransporter),
      ],
    })
  }

  public getLoggerInstance(level: string): WinstonLogger {
    return this.getLogger(level)
  }
}

export const logger = new DataDogBrowserLogger(DATA_DOG_SITE_US).getLoggerInstance('main')
export const serverLogger = new WinstonServerLogger(datadogTransporter).getLoggerInstance('info')
