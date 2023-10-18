import { useCakePrice } from 'hooks/useCakePrice'
import { useBNBPrice } from 'hooks/useBNBPrice'
import { useStablecoinPrice } from 'hooks/useBUSDPrice'
import { Currency } from '@pancakeswap/swap-sdk-core'
import { bscTokens } from '@pancakeswap/tokens'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'

export const useTokenPrice = (token: Currency, enabled = true): BigNumber => {
  const enableCake = useMemo(() => enabled && token.equals(bscTokens.cake), [enabled, token])
  const enableBnb = useMemo(() => enabled && token.equals(bscTokens.bnb), [enabled, token])
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
