import retry from 'async-retry'
import { GaugeConfig } from '../../types'
import { GAUGES_API } from './endpoint'

let cache: GaugeConfig[] | undefined
let promiseQueue: ((value: GaugeConfig[] | PromiseLike<GaugeConfig[]>) => void)[] = []
let inProgress = false

export const getGauges = async (): Promise<GaugeConfig[]> => {
  if (cache) return Promise.resolve(cache)

  if (inProgress) {
    return new Promise((resolve) => promiseQueue.push(resolve))
  }

  inProgress = true

  return new Promise((resolve) => {
    retry(
      async () => {
        const response = await fetch(GAUGES_API, {
          signal: AbortSignal.timeout(3000),
        })
        if (response.ok) {
          const result = await response.json()
          cache = result
          resolve(result)

          // Resolve all queued promises with the fetched result
          promiseQueue.forEach((queuedResolve) => queuedResolve(result))
          promiseQueue = []
          inProgress = false

          return result
        }
        throw new Error(`Fetch failed with status: ${response.status}`)
      },
      {
        retries: 3,
        minTimeout: 0,
        onRetry: (error: Error, attempt: number) => {
          console.warn(`Attempt ${attempt} failed: ${error.message}. Retrying...`)
        },
      },
    ).catch((error: Error) => {
      console.error('Failed to fetch gauges config after retries: ', error)

      promiseQueue.forEach((queuedResolve) => queuedResolve([]))
      promiseQueue = []
      inProgress = false

      resolve([])
    })
  })
}
