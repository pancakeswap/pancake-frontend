import { pancakeRouter02ABI } from 'config/abi/IPancakeRouter02'
import { V2_ROUTER_ADDRESS } from 'config/constants/exchange'

import { useActiveChainId } from 'hooks/useActiveChainId'
import { useContract } from 'hooks/useContract'

export function useRouterContract() {
  const { chainId } = useActiveChainId()
  return useContract(chainId && (V2_ROUTER_ADDRESS as any)[chainId], pancakeRouter02ABI)
}
