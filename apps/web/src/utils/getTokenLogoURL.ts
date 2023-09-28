import memoize from 'lodash/memoize'
import { Token } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { safeGetAddress } from 'utils'
import { isAddress } from 'viem'

const mapping = {
  [ChainId.BSC]: 'smartchain',
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.POLYGON_ZKEVM]: 'polygonzkevm',
  [ChainId.ZKSYNC]: 'zksync',
  [ChainId.ARBITRUM_ONE]: 'arbitrum',
  [ChainId.LINEA]: 'linea',
}

const getTokenLogoURL = memoize(
  (token?: Token) => {
    if (token && mapping[token.chainId] && isAddress(token.address)) {
      return `https://assets-cdn.trustwallet.com/blockchains/${mapping[token.chainId]}/assets/${safeGetAddress(
        token.address,
      )}/logo.png`
    }
    return null
  },
  (t) => `${t?.chainId}#${t?.address}`,
)

export const getTokenLogoURLByAddress = memoize(
  (address?: string, chainId?: number) => {
    if (address && chainId && mapping[chainId] && isAddress(address)) {
      return `https://assets-cdn.trustwallet.com/blockchains/${mapping[chainId]}/assets/${safeGetAddress(
        address,
      )}/logo.png`
    }
    return null
  },
  (address, chainId) => `${chainId}#${address}`,
)

export default getTokenLogoURL
