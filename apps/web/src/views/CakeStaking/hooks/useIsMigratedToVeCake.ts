import { ChainId } from '@pancakeswap/chains'
import { isAddressEqual, zeroAddress } from 'viem'
import { useVeCakeUserInfo } from './useVeCakeUserInfo'

export const useIsMigratedToVeCake = (targetChainId?: ChainId) => {
  const { data } = useVeCakeUserInfo(targetChainId)
  if (!data) return false
  if (isAddressEqual(data.cakePoolProxy, zeroAddress)) return false
  return true
}
