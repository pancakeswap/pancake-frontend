import { useCallback } from 'react'

const useHarvestFarm = (farmPid: number) => {
  const handleHarvest = useCallback(async () => {
    return null
  }, [])

  return { onReward: handleHarvest }
}

export default useHarvestFarm
