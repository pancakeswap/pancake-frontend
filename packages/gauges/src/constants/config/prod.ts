import { GaugeConfig } from '../../types'

export const CONFIG_PROD = async (): Promise<GaugeConfig[]> => {
  try {
    const response = await fetch('https://cms-public-api-7ys4p.ondigitalocean.app/api/data/gauges')
    if (response.ok) {
      const result = await response.json()
      return result
    }
    throw response
  } catch (error) {
    console.error('Failed to fetch gauges config: ', error)
    return []
  }
}
