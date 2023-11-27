import { FEATURE_FLAGS } from 'contexts/ABTestingContext/config'

export interface HttpTransportOptions {
  host: string
  path: string
  ssl: boolean
  hostname: string
  service: string
  ddsource: string
  ddtags: string
  enablelogs: boolean
}

export type DatadogPayload<T extends HttpTransportOptions> = T & { [key: string]: unknown }

export const httpTransportOptions: HttpTransportOptions = {
  host: 'https://http-intake.logs.datadoghq.eu',
  path: `/api/v2/logs?dd-api-key=${'66733d73f0a92f7104e1721da457afa3'}&ddsource=nodejs&service=${'notifications_service_pcs'}`,
  ssl: true,
  hostname: 'localhost_DEV',
  service: 'notifications_service_pcs',
  ddsource: 'nodejs',
  ddtags: `env:${'DEV'}`,
  enablelogs: true,
}

type FeatureFlagArgsMap = {
  [FEATURE_FLAGS.WebNotifications]: { ip?: string; userHashResult?: number; error?: any }
}

type GenerateEncodedQueryParams = {
  [K in FEATURE_FLAGS]: <T extends FeatureFlagArgsMap[K]>(args: T) => string
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

export const generateEncodedQueryParams: GenerateEncodedQueryParams = {
  [FEATURE_FLAGS.WebNotifications]: ({ ip, userHashResult, error }) => {
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
      datadogData: `userIp: ${ip}, userHashResult: ${userHashResult}`,
      status: '[Feature Running]',
    }
    return Object.entries(successData)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')
  },
  // Add other feature flag functions for encoding message params
}
