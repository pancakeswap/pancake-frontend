import { GaugeConfig } from '../../types'

export const CONFIG_PROD = (): GaugeConfig[] => {
  const data = fetch('https://cms-public-api-7ys4p.ondigitalocean.app/api/data/gauges')
    .then(async (response) => {
      const result = await response.json()
      return result as GaugeConfig[]
    })
    .catch((error) => {
      console.error('Failed to fetch gauges config:', error)
      return []
    })

  return data as unknown as GaugeConfig[]
}
