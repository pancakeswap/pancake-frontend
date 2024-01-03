import { ChainId } from '@pancakeswap/chains'
import { perpLangMap } from 'utils/getPerpetualLanguageCode'
import { perpTheme } from 'utils/getPerpetualTheme'

interface GetPerpetualUrlProps {
  chainId: ChainId | undefined
  languageCode: string | undefined
  isDark: boolean
}

const mapPerpChain = (chainId: ChainId): string => {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return 'ethereum'
    case ChainId.ARBITRUM_ONE:
      return 'arbitrum'
    case ChainId.OPBNB:
      return 'opbnb'
    case ChainId.BASE:
      return 'base'
    default:
      return 'bsc'
  }
}

const supportV1Chains: ChainId[] = [ChainId.ETHEREUM]

export const getPerpetualUrl = ({ chainId, languageCode, isDark }: GetPerpetualUrlProps) => {
  if (!chainId || !languageCode) {
    return 'https://perp.pancakeswap.finance/en/futures/v2/BTCUSD'
  }

  const perpChain = mapPerpChain(chainId)
  const version = supportV1Chains.includes(chainId) ? '' : 'v2/'
  return `https://perp.pancakeswap.finance/${perpLangMap(languageCode)}/futures/${version}BTCUSD?theme=${perpTheme(
    isDark,
  )}&chain=${perpChain}`
}
