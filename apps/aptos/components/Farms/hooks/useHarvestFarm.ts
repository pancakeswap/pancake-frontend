import { useCallback } from 'react'

const useHarvestFarm = (_farmPid: number) => {
  const handleHarvest = useCallback(async () => {
    return null
  }, [])

  return { onReward: handleHarvest }
}

export default useHarvestFarm
