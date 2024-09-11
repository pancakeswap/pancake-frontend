import { useMemo } from 'react'

export const useIsRenderTgPredictionBotBanner = () => {
  const endTime = 1726059600 // 11 September 2024 13:00:00 GMT

  return useMemo(() => new Date().getTime() / 1000 >= endTime, [endTime])
}
