import { Percent } from '@pancakeswap/sdk'
import { pancakeRouter02ABI } from 'config/abi/IPancakeRouter02'
import { BIPS_BASE, V2_ROUTER_ADDRESS } from 'config/constants/exchange'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useContract } from 'hooks/useContract'
import memoize from 'lodash/memoize'

// converts a basis points value to a sdk percent
export const basisPointsToPercent = memoize((num: number): Percent => {
  return new Percent(BigInt(num), BIPS_BASE)
})

export function useRouterContract() {
  const { chainId } = useActiveChainId()
  return useContract(chainId && (V2_ROUTER_ADDRESS as any)[chainId], pancakeRouter02ABI)
}
