import { TokenData as TokenDataV2 } from 'state/info/types'
import { TokenData as TokenDataV3 } from 'views/V3Info/types'

import { TokenHighlightData } from './types'

export const parseV2TokenData = (tokenData: TokenDataV2): TokenHighlightData => {
  const {
    name,
    symbol,
    address,
    decimals,
    priceUSD,
    priceUSDChange,
    volumeUSD,
    pairs,
    liquidityUSD,
    liquidityUSDChange,
  } = tokenData
  return {
    name,
    symbol,
    address,
    tvlUSD: liquidityUSD,
    tvlUSDChange: liquidityUSDChange,
    priceUSD,
    priceUSDChange,
    volumeUSD,
    pairs,
    decimals,
  }
}

export const parseV3TokenData = (tokenData: TokenDataV3): TokenHighlightData => {
  const { name, symbol, decimals, address, priceUSD, priceUSDChange, volumeUSD, tvlUSD, tvlUSDChange } = tokenData
  return {
    name,
    symbol,
    address,
    decimals,
    tvlUSD,
    tvlUSDChange,
    priceUSD,
    priceUSDChange,
    volumeUSD,
  }
}
