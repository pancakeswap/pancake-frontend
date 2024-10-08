import { GaugeConfig } from '../../types'
import { GAUGES_API } from './endpoint'

function createGaugeConfigFetcher() {
  let gauges: GaugeConfig[] | undefined
  let fetchRequest: Promise<GaugeConfig[]> | undefined

  return async function getGaugeConfig() {
    if (fetchRequest) return fetchRequest
    const fetchGaugeConfig = async () => {
      if (gauges) {
        return gauges
      }
      try {
        const response = await fetch(GAUGES_API, {
          signal: AbortSignal.timeout(3000),
        })
        if (response.ok) {
          gauges = await response.json()
          if (!gauges) {
            throw new Error(`Unexpected empty gauges fetched from remote ${gauges}`)
          }
          return gauges
        }
        throw new Error(`Fetch failed with status: ${response.status}`)
      } catch (e) {
        if (e instanceof Error) {
          throw new Error(`Fetch failed: ${e.message}`)
        } else {
          throw new Error(`Fetch failed: ${e}`)
        }
      } finally {
        fetchRequest = undefined
      }
    }
    fetchRequest = fetchGaugeConfig()
    return fetchRequest
  }
}

export const getGauges = createGaugeConfigFetcher()
