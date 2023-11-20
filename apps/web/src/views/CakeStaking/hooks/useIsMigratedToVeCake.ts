import { useVeCakeUserInfo } from './useVeCakeUserInfo'

export const useIsMigratedToVeCake = () => {
  const { data } = useVeCakeUserInfo()
  if (!data) return false
  if (data.cakePoolProxy !== '0x0000000000000000000000000000000000000000') return true
  return false
}
