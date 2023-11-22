import { isAddressEqual, zeroAddress } from 'viem'
import { useVeCakeUserInfo } from './useVeCakeUserInfo'

export const useIsMigratedToVeCake = () => {
  const { data } = useVeCakeUserInfo()
  if (!data) return false
  if (isAddressEqual(data.cakePoolProxy, zeroAddress)) return false
  return true
}
