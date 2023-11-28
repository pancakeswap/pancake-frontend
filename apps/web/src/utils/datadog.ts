import { datadogLogs, LogsInitConfiguration } from '@datadog/browser-logs'
import Transport from 'winston-transport'

export interface HttpTransportOptions {
  host: string
  path: string
  ssl: boolean
}

export type DatadogPayload<T extends HttpTransportOptions> = T & { [key: string]: unknown }

export interface DDTransporter {
  payload: <T extends HttpTransportOptions>(payload: DatadogPayload<T>) => void
}

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

// server
export class CustomDatadogTransport extends Transport {
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
export const httpTransportOptions: HttpTransportOptions = {
  host: 'https://http-intake.logs.datadoghq.eu',
  path: `/api/v2/logs?dd-api-key=${'66733d73f0a92f7104e1721da457afa3'}&ddsource=nodejs&service=${'notifications_service_pcs'}`,
  ssl: true,
}

export const datadogTransporter = async <T extends HttpTransportOptions>(payload: DatadogPayload<T>) => {
  if (!payload.enablelogs) return

  const { level, message, timestamp, metadata, sendLog } = payload
  const messageDate = `[${payload.service}]${message}[${new Date().toISOString()}]`

  if (sendLog || level === 'error' || level === 'warn') {
    const data = [
      {
        level,
        metadata,
        timestamp,
        message: messageDate,
        service: payload.service,
        ddsource: payload.ddsource,
        ddtags: payload.ddtags,
      },
    ]
    try {
      const response = await fetch(`${payload.host}${payload.path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Network response was not ok')
      await response.json()
    } catch (error: any) {
      throw new Error(error instanceof Error ? error.message : error)
    }
  }
}

export const generateEncodedQueryParams = ({
  ip,
  userWhitelistResults,
  error,
}: {
  ip?: string
  userWhitelistResults?: string[]
  error?: any
}) => {
  if (error) {
    const errorData = {
      datadogData: `Something went wrong Error: ${JSON.stringify(error)}`,
      status: '[Feature failing]',
    }
    return Object.entries(errorData)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')
  }

  const successData = {
    datadogData: `userIp: ${ip}, userWhitelistResults: ${userWhitelistResults}`,
    status: '[Feature Running]',
  }
  return Object.entries(successData)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}
// Add other feature flag functions for encoding message params

export const logger = getLogger('main')
