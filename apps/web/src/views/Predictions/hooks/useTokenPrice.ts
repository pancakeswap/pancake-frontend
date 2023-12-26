import { Currency } from '@pancakeswap/swap-sdk-core'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { useStablecoinPrice } from 'hooks/useBUSDPrice'

export const useTokenPrice = (token: Currency | undefined, enabled = true): BigNumber => {
  const tokenPrice = useStablecoinPrice(token, { enabled })
  return tokenPrice ? new BigNumber(tokenPrice.toSignificant(18)) : BIG_ZERO
}
