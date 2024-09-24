import { GaugeConfig } from '../../types'

export const CONFIG_PROD = async (): Promise<GaugeConfig[]> => {
  const data = await fetch('https://cms-public-api-7ys4p.ondigitalocean.app/api/data/gauges')
    .then((response) => response.json())
    .catch((error) => {
      console.error('Failed to fetch gauges config:', error)
      return []
    })

  return data as GaugeConfig[]
}
