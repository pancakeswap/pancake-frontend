import { ChainId } from '@pancakeswap/sdk'
import { perpLangMap } from 'utils/getPerpetualLanguageCode'
import { perpTheme } from 'utils/getPerpetualTheme'

interface GetPerpetualUrlProps {
  chainId: ChainId
  languageCode: string
  isDark: boolean
}

const mapPerpChain = (chainId: ChainId): string => {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return 'ethereum'
    case ChainId.ARBITRUM_ONE:
      return 'arbitrum'
    default:
      return 'bnbchain'
  }
}

const supportV2Chains: ChainId[] = [ChainId.BSC, ChainId.ARBITRUM_ONE]

export const getPerpetualUrl = ({ chainId, languageCode, isDark }: GetPerpetualUrlProps) => {
  const perpChain = mapPerpChain(chainId)
  const version = supportV2Chains.includes(chainId) ? 'v2/' : ''
  return `https://perp.pancakeswap.finance/${perpLangMap(languageCode)}/futures/${version}BTCUSD?theme=${perpTheme(
    isDark,
  )}&chain=${perpChain}`
}
