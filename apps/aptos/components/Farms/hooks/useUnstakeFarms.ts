import { useCallback } from 'react'

const useUnstakeFarms = (_pid: number) => {
  const handleUnstake = useCallback(async (_amount: string) => {
    return null
  }, [])

  return { onUnstake: handleUnstake }
}

export default useUnstakeFarms
