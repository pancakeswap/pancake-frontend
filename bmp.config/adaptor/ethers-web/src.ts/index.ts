/* eslint-disable no-await-in-loop -- the original code use await-in-loop, to avoid bug, disable the rule */
import { encode as base64Encode } from '@ethersproject/base64'
import { hexlify, isBytesLike } from '@ethersproject/bytes'
import { shallowCopy } from '@ethersproject/properties'
import { toUtf8Bytes, toUtf8String } from '@ethersproject/strings'

import { Logger } from '@ethersproject/logger'
import { version } from './_version'

import { getUrl, GetUrlResponse, Options } from './geturl'

const logger = new Logger(version)

function staller(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}

function bodyify(value: any, type: string | null): string | null {
  if (value == null) {
    return null
  }

  if (typeof value === 'string') {
    return value
  }

  if (isBytesLike(value)) {
    if (type && (type.split('/')[0] === 'text' || type.split(';')[0].trim() === 'application/json')) {
      try {
        return toUtf8String(value)
      } catch (error) {}
    }
    return hexlify(value)
  }

  return value
}

// Exported Types
export type ConnectionInfo = {
  url: string
  headers?: { [key: string]: string | number }

  user?: string
  password?: string

  allowInsecureAuthentication?: boolean
  allowGzip?: boolean

  throttleLimit?: number
  throttleSlotInterval?: number
  throttleCallback?: (attempt: number, url: string) => Promise<boolean>

  timeout?: number
}

export interface OnceBlockable {
  once(eventName: 'block', handler: () => void): void
}

export interface OncePollable {
  once(eventName: 'poll', handler: () => void): void
}

export type PollOptions = {
  timeout?: number
  floor?: number
  ceiling?: number
  interval?: number
  retryLimit?: number
  onceBlock?: OnceBlockable
  oncePoll?: OncePollable
}

export type FetchJsonResponse = {
  statusCode: number
  headers: { [header: string]: string }
}

type Header = { key: string; value: string }

// This API is still a work in progress; the future changes will likely be:
// - ConnectionInfo => FetchDataRequest<T = any>
// - FetchDataRequest.body? = string | Uint8Array | { contentType: string, data: string | Uint8Array }
//   - If string => text/plain, Uint8Array => application/octet-stream (if content-type unspecified)
// - FetchDataRequest.processFunc = (body: Uint8Array, response: FetchDataResponse) => T
// For this reason, it should be considered internal until the API is finalized
export function _fetchData<T = Uint8Array>(
  connection: string | ConnectionInfo,
  body?: Uint8Array | null,
  processFunc?: (value: Uint8Array | null, response: FetchJsonResponse) => T,
): Promise<T> {
  // How many times to retry in the event of a throttle
  const attemptLimit =
    typeof connection === 'object' && connection.throttleLimit != null ? connection.throttleLimit : 12
  logger.assertArgument(
    attemptLimit > 0 && attemptLimit % 1 === 0,
    'invalid connection throttle limit',
    'connection.throttleLimit',
    attemptLimit,
  )

  const throttleCallback = typeof connection === 'object' ? connection.throttleCallback : null
  const throttleSlotInterval =
    typeof connection === 'object' && typeof connection.throttleSlotInterval === 'number'
      ? connection.throttleSlotInterval
      : 100
  logger.assertArgument(
    throttleSlotInterval > 0 && throttleSlotInterval % 1 === 0,
    'invalid connection throttle slot interval',
    'connection.throttleSlotInterval',
    throttleSlotInterval,
  )

  const headers: { [key: string]: Header } = {}

  let url: string | null = null

  // @TODO: Allow ConnectionInfo to override some of these values
  const options: Options = {
    method: 'GET',
  }

  let allow304 = false

  let timeout = 2 * 60 * 1000

  if (typeof connection === 'string') {
    url = connection
  } else if (typeof connection === 'object') {
    if (connection == null || connection.url == null) {
      logger.throwArgumentError('missing URL', 'connection.url', connection)
    }

    url = connection.url

    if (typeof connection.timeout === 'number' && connection.timeout > 0) {
      timeout = connection.timeout
    }

    if (connection.headers) {
      for (const key of Object.keys(connection.headers)) {
        headers[key.toLowerCase()] = { key, value: String(connection.headers[key]) }
        if (['if-none-match', 'if-modified-since'].indexOf(key.toLowerCase()) >= 0) {
          allow304 = true
        }
      }
    }

    options.allowGzip = !!connection.allowGzip

    if (connection.user != null && connection.password != null) {
      if (url.substring(0, 6) !== 'https:' && connection.allowInsecureAuthentication !== true) {
        logger.throwError('basic authentication requires a secure https url', Logger.errors.INVALID_ARGUMENT, {
          argument: 'url',
          url,
          user: connection.user,
          password: '[REDACTED]',
        })
      }

      const authorization = `${connection.user}:${connection.password}`
      headers.authorization = {
        key: 'Authorization',
        value: `Basic ${base64Encode(toUtf8Bytes(authorization))}`,
      }
    }
  }

  if (body) {
    options.method = 'POST'
    options.body = body
    if (headers['content-type'] == null) {
      headers['content-type'] = { key: 'Content-Type', value: 'application/octet-stream' }
    }
    if (headers['content-length'] == null) {
      headers['content-length'] = { key: 'Content-Length', value: String(body.length) }
    }
  }

  const flatHeaders: { [key: string]: string } = {}
  Object.keys(headers).forEach((key) => {
    const header = headers[key]
    flatHeaders[header.key] = header.value
  })
  options.headers = flatHeaders

  const runningTimeout = (() => {
    let timer: ReturnType<typeof setTimeout> | null = null
    const promise: Promise<never> = new Promise((_resolve, reject) => {
      if (timeout) {
        timer = setTimeout(() => {
          if (timer == null) {
            return
          }
          timer = null

          reject(
            logger.makeError('timeout', Logger.errors.TIMEOUT, {
              requestBody: bodyify(options.body, flatHeaders['content-type']),
              requestMethod: options.method,
              timeout,
              url,
            }),
          )
        }, timeout)
      }
    })

    const cancel = function () {
      if (timer == null) {
        return
      }
      clearTimeout(timer)
      timer = null
    }

    return { promise, cancel }
  })()

  const runningFetch = (async () => {
    for (let attempt = 0; attempt < attemptLimit; attempt++) {
      let response: GetUrlResponse | null = null

      try {
        if (!url) {
          throw new Error('no url')
        }
        response = await getUrl(url, options)

        // Exponential back-off throttling
        if (response.statusCode === 429 && attempt < attemptLimit) {
          let tryAgain = true
          if (throttleCallback) {
            tryAgain = await throttleCallback(attempt, url)
          }

          if (tryAgain) {
            let stall = 0

            const retryAfter = response.headers['retry-after']
            if (typeof retryAfter === 'string' && retryAfter.match(/^[1-9][0-9]*$/)) {
              stall = parseInt(retryAfter, 10) * 1000
            } else {
              stall = throttleSlotInterval * parseInt(String(Math.random() * 2 ** attempt), 10)
            }

            // console.log("Stalling 429");
            await staller(stall)
            continue
          }
        }
      } catch (error) {
        response = (<any>error).response
        if (response == null) {
          runningTimeout.cancel()
          logger.throwError('missing response', Logger.errors.SERVER_ERROR, {
            requestBody: bodyify(options.body, flatHeaders['content-type']),
            requestMethod: options.method,
            serverError: error,
            url,
          })
        }
      }
      if (response === null) {
        continue
      }
      let responseBody: GetUrlResponse['body'] | null = response.body

      if (allow304 && response.statusCode === 304) {
        responseBody = null
      } else if (response.statusCode < 200 || response.statusCode >= 300) {
        runningTimeout.cancel()
        logger.throwError('bad response', Logger.errors.SERVER_ERROR, {
          status: response.statusCode,
          headers: response.headers,
          body: bodyify(responseBody, response.headers ? response.headers['content-type'] : null),
          requestBody: bodyify(options.body, flatHeaders['content-type']),
          requestMethod: options.method,
          url,
        })
      }

      if (processFunc) {
        try {
          const result = await processFunc(responseBody, response)
          runningTimeout.cancel()
          return result
        } catch (error) {
          // Allow the processFunc to trigger a throttle
          if (error.throttleRetry && attempt < attemptLimit) {
            let tryAgain = true
            if (throttleCallback) {
              tryAgain = await throttleCallback(attempt, url)
            }

            if (tryAgain) {
              const tryAgainTimeout = throttleSlotInterval * parseInt(String(Math.random() * 2 ** attempt), 10)
              // console.log("Stalling callback");
              await staller(tryAgainTimeout)
              continue
            }
          }

          runningTimeout.cancel()
          logger.throwError('processing response error', Logger.errors.SERVER_ERROR, {
            body: bodyify(responseBody, response.headers ? response.headers['content-type'] : null),
            error,
            requestBody: bodyify(options.body, flatHeaders['content-type']),
            requestMethod: options.method,
            url,
          })
        }
      }

      runningTimeout.cancel()

      // If we had a processFunc, it eitehr returned a T or threw above.
      // The "body" is now a Uint8Array.
      return <T>(<unknown>responseBody)
    }

    return logger.throwError('failed response', Logger.errors.SERVER_ERROR, {
      requestBody: bodyify(options.body, flatHeaders['content-type']),
      requestMethod: options.method,
      url,
    })
  })()

  return Promise.race([runningTimeout.promise, runningFetch])
}

export function fetchJson(
  connection: string | ConnectionInfo,
  json?: string,
  processFunc?: (value: any, response: FetchJsonResponse) => any,
): Promise<any> {
  const processJsonFunc = (value: Uint8Array, response: FetchJsonResponse) => {
    let result: any = null
    if (value != null) {
      try {
        result = JSON.parse(toUtf8String(value))
      } catch (error) {
        logger.throwError('invalid JSON', Logger.errors.SERVER_ERROR, {
          body: value,
          error,
        })
      }
    }

    if (processFunc) {
      result = processFunc(result, response)
    }

    return result
  }

  // If we have json to send, we must
  // - add content-type of application/json (unless already overridden)
  // - convert the json to bytes
  let body: Uint8Array | null = null
  if (json != null) {
    body = toUtf8Bytes(json)

    // Create a connection with the content-type set for JSON
    const updated: ConnectionInfo = typeof connection === 'string' ? { url: connection } : shallowCopy(connection)
    if (updated.headers) {
      const hasContentType = Object.keys(updated.headers).filter((k) => k.toLowerCase() === 'content-type').length !== 0
      if (!hasContentType) {
        updated.headers = shallowCopy(updated.headers)
        updated.headers['content-type'] = 'application/json'
      }
    } else {
      updated.headers = { 'content-type': 'application/json' }
    }
    connection = updated
  }

  return _fetchData<any>(connection, body, processJsonFunc)
}

export function poll<T>(func: () => Promise<T>, options?: PollOptions): Promise<T> {
  if (!options) {
    options = {}
  }
  options = shallowCopy(options)
  if (options.floor == null) {
    options.floor = 0
  }
  if (options.ceiling == null) {
    options.ceiling = 10000
  }
  if (options.interval == null) {
    options.interval = 250
  }

  return new Promise((resolve, reject) => {
    let timer: number
    let done = false

    // Returns true if cancel was successful. Unsuccessful cancel means we're already done.
    const cancel = (): boolean => {
      if (done) {
        return false
      }
      done = true
      if (timer) {
        clearTimeout(timer)
      }
      return true
    }

    if (options?.timeout) {
      timer = setTimeout(() => {
        if (cancel()) {
          reject(new Error('timeout'))
        }
      }, options!.timeout)
    }

    const { retryLimit } = options || {}

    let attempt = 0
    function check() {
      return func().then(
        (result) => {
          // If we have a result, or are allowed null then we're done
          if (result !== undefined) {
            if (cancel()) {
              resolve(result)
            }
          } else if (options?.oncePoll) {
            options.oncePoll.once('poll', check)
          } else if (options?.onceBlock) {
            options.onceBlock.once('block', check)

            // Otherwise, exponential back-off (up to 10s) our next request
          } else if (!done) {
            attempt += 1
            if (typeof retryLimit !== 'undefined' && attempt > retryLimit) {
              if (cancel()) {
                reject(new Error('retry limit reached'))
              }
              return
            }
            let timeout =
              typeof options?.interval !== 'undefined'
                ? options.interval * parseInt(String(Math.random() * 2 ** attempt), 10)
                : NaN
            if (typeof options?.floor !== 'undefined' && timeout < options.floor) {
              timeout = options.floor
            }
            if (typeof options?.ceiling !== 'undefined' && timeout > options.ceiling) {
              timeout = options.ceiling
            }

            setTimeout(check, timeout)
          }
        },
        (error) => {
          if (cancel()) {
            reject(error)
          }
        },
      )
    }
    check()
  })
}

/* eslint-enable no-await-in-loop -- enable the rule */
