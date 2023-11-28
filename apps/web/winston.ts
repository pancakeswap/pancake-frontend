import { createLogger, format, transports, Logger as WinstonLogger } from 'winston'
import { CustomDatadogTransport, DatadogPayload, datadogTransporter, HttpTransportOptions } from './src/utils/datadog'

const { combine, timestamp, json, errors } = format

interface DDTransporter {
  payload: <T extends HttpTransportOptions>(payload: DatadogPayload<T>) => void
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

        new CustomDatadogTransport(this.datadogTransporter),
      ],
    })
  }

  public getLoggerInstance(level: string): WinstonLogger {
    return this.getLogger(level)
  }
}
export const serverLogger = new WinstonServerLogger(datadogTransporter).getLoggerInstance('info')
