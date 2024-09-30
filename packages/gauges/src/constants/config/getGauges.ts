import retry from 'async-retry'
import { GaugeConfig } from '../../types'
import { GAUGES_API } from './endpoint'

let cache: GaugeConfig[] | undefined
let ongoingRequest: Promise<GaugeConfig[]> | null = null

export const getGauges = async (): Promise<GaugeConfig[]> => {
  if (cache) return Promise.resolve(cache)

  // If there's an ongoing request, reuse the promise
  if (ongoingRequest) {
    return ongoingRequest
  }

  ongoingRequest = retry(
    async () => {
      const response = await fetch(GAUGES_API, {
        signal: AbortSignal.timeout(3000),
      })
      if (response.ok) {
        const result: GaugeConfig[] = await response.json()
        cache = result
        ongoingRequest = null // Clear the ongoing request
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
    ongoingRequest = null // Clear the ongoing request on failure
    throw error
  })

  return ongoingRequest
}
