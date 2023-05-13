import { ChainId } from '@pancakeswap/sdk'
import { perpLangMap } from 'utils/getPerpetualLanguageCode'
import { perpTheme } from 'utils/getPerpetualTheme'

interface GetPerpetualUrlProps {
  chainId: ChainId
  languageCode: string
  isDark: boolean
}

export const getPerpetualUrl = ({ chainId, languageCode, isDark }: GetPerpetualUrlProps) => {
  const perpChain = chainId === ChainId.ETHEREUM ? 'ethereum' : 'bnbchain'
  const version = chainId === ChainId.BSC ? 'v2/' : ''
  return `https://perp.pancakeswap.finance/${perpLangMap(languageCode)}/futures/${version}BTCUSD?theme=${perpTheme(
    isDark,
  )}&chain=${perpChain}`
}
