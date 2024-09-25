import retry from 'async-retry'
import { GaugeConfig } from '../../types'

let cache: GaugeConfig[] | undefined
let promiseQueue: ((value: GaugeConfig[] | PromiseLike<GaugeConfig[]>) => void)[] = []
let inProgress = false

export const CONFIG_PROD = async (): Promise<GaugeConfig[]> => {
  if (cache) return Promise.resolve(cache)

  if (inProgress) {
    return new Promise((resolve) => promiseQueue.push(resolve))
  }

  inProgress = true

  return new Promise((resolve) => {
    retry(
      async () => {
        const response = await fetch('https://cms-public-api-7ys4p.ondigitalocean.app/api/data/gauges')
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
        factor: 2,
        minTimeout: 1000,
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
