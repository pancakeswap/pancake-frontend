import { ChainId } from '@pancakeswap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'

const useIsRenderUserBanner = () => {
  const { chainId, account } = useActiveWeb3React()
  return useMemo(() => {
    return Boolean(account) && chainId === ChainId.BSC
  }, [account, chainId])
}

export default useIsRenderUserBanner
