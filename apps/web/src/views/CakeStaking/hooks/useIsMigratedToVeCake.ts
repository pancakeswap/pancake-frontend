import { ChainId } from '@pancakeswap/chains'
import { zeroAddress } from 'viem'
import { safeGetAddress } from 'utils'
import { useVeCakeUserInfo } from './useVeCakeUserInfo'

export const useIsMigratedToVeCake = (targetChainId?: ChainId) => {
  const { data } = useVeCakeUserInfo(targetChainId)
  if (!data) return false
  if (safeGetAddress(data.cakePoolProxy) === zeroAddress) return false
  return true
}
