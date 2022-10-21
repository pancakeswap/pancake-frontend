import { useCallback } from 'react'

const useStakeFarms = (_pid: number) => {
  const handleStake = useCallback(async (_amount: string) => {
    return null
  }, [])

  return { onStake: handleStake }
}

export default useStakeFarms
