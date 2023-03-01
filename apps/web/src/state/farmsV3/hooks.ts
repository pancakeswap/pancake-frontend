import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { farmSelector } from './selectors'

export const useFarmsV3 = () => {
  const { chainId } = useActiveChainId()
  return useSelector(useMemo(() => farmSelector(chainId), [chainId]))
}
