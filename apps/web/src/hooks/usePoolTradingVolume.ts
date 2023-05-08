import { usePoolAvgInfo, UsePoolAvgInfoParams } from './usePoolAvgInfo'

export function usePoolAvgTradingVolume(params: UsePoolAvgInfoParams) {
  const { volumeUSD } = usePoolAvgInfo(params)
  return volumeUSD
}
