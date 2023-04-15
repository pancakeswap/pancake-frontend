import { ethersToBigNumber } from '@pancakeswap/utils/bigNumber'
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber'

export const getDisplayFarmCakePerSecond = (
  allocPoint?: number,
  totalRegularAllocPoint?: EthersBigNumber,
  cakePerBlock?: EthersBigNumber,
) => {
  if (!allocPoint || !totalRegularAllocPoint || !cakePerBlock) return '-'

  const farmCakePerSecond =
    ((allocPoint / ethersToBigNumber(totalRegularAllocPoint).toNumber()) * ethersToBigNumber(cakePerBlock).toNumber()) /
    1e8

  return farmCakePerSecond < 0.000001 ? '<0.000001' : `~${farmCakePerSecond.toFixed(6)}`
}
