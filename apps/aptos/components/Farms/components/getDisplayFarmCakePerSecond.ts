import { ethersToBigNumber } from '@pancakeswap/utils/bigNumber'
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber'

export const getDisplayFarmCakePerSecond = (poolWeight?: number, cakePerBlock?: EthersBigNumber) => {
  if (!poolWeight || !cakePerBlock) return '0'

  const farmCakePerSecond = (poolWeight * ethersToBigNumber(cakePerBlock).toNumber()) / 1e8

  return farmCakePerSecond < 0.000001 ? '<0.000001' : `~${farmCakePerSecond.toFixed(6)}`
}
