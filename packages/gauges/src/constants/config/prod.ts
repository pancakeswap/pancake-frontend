import { GaugeConfig } from '../../types'

export const CONFIG_PROD = async (): Promise<GaugeConfig[]> => {
  try {
    const response = await fetch('https://cms-public-api-7ys4p.ondigitalocean.app/api/data/gauges')
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Failed to fetch gauges config: ', error)
    return []
  }
}
