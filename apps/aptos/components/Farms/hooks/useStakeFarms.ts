import { useCallback } from 'react'

const useStakeFarms = (pid: number) => {
  const handleStake = useCallback(async (amount: string) => {
    return null
  }, [])

  return { onStake: handleStake }
}

export default useStakeFarms
