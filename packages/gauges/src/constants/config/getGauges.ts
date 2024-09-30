import retry from 'async-retry'
import { GaugeConfig } from '../../types'
import { GAUGES_API } from './endpoint'

let cache: Record<string, GaugeConfig[]> | undefined
let ongoingRequest: Promise<Record<string, GaugeConfig[]>> | null = null

export const getGauges = async (useFreshData = false): Promise<Record<string, GaugeConfig[]> | null> => {
  if (!useFreshData && cache) return Promise.resolve(cache)

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
        const groupedByChainId = result.reduce<Record<string, GaugeConfig[]>>((acc, gauge) => {
          const { chainId } = gauge
          if (!acc[chainId]) {
            // eslint-disable-next-line no-param-reassign
            acc[chainId] = []
          }
          acc[chainId].push(gauge)
          return acc
        }, {})

        cache = groupedByChainId
        ongoingRequest = null // Clear the ongoing request
        return groupedByChainId
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
    return {} // Resolve with an empty object without caching it
  })

  return ongoingRequest
}

export const getAllFlatGauges = async (useFreshData = false): Promise<GaugeConfig[]> => {
  const gaugesByChainId = await getGauges(useFreshData)
  if (!gaugesByChainId) {
    return []
  }
  return Object.values(gaugesByChainId).reduce((acc, val) => acc.concat(val), [])
}
