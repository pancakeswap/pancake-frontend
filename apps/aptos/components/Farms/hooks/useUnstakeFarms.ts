import { useCallback } from 'react'

const useUnstakeFarms = (pid: number) => {
  const handleUnstake = useCallback(async (amount: string) => {
    return null
  }, [])

  return { onUnstake: handleUnstake }
}

export default useUnstakeFarms
