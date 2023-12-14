import { Currency } from '@pancakeswap/swap-sdk-core'
import { bscTokens } from '@pancakeswap/tokens'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { useBNBPrice } from 'hooks/useBNBPrice'
import { useStablecoinPrice } from 'hooks/useBUSDPrice'
import { useCakePrice } from 'hooks/useCakePrice'
import { useMemo } from 'react'

export const useTokenPrice = (token: Currency, enabled = true): BigNumber => {
  const enableCake = useMemo(() => enabled && token?.equals(bscTokens.cake), [enabled, token])
  const enableBnb = useMemo(() => enabled && token?.equals(bscTokens.bnb), [enabled, token])
  const enableOther = useMemo(() => enabled && !enableCake && !enableBnb, [enabled, enableCake, enableBnb])

  const cakePrice = useCakePrice({ enabled: enableCake })
  const bnbPrice = useBNBPrice({ enabled: enableBnb })
  const tokenPrice = useStablecoinPrice(token, { enabled: enableOther })

  if (enableCake) {
    return cakePrice
  }
  if (enableBnb) {
    return bnbPrice
  }
  return tokenPrice ? new BigNumber(tokenPrice.toSignificant(18)) : BIG_ZERO
}
