import { getAddress } from 'ethers/lib/utils'
import memoize from 'lodash/memoize'
import { ChainId, Token } from '@pancakeswap/sdk'

const mapping = {
  [ChainId.BSC]: 'smartchain',
  [ChainId.ETHEREUM]: 'ethereum',
}

const chainName: { [key: number]: string } = {
  [ChainId.BSC]: '',
  [ChainId.ETHEREUM]: 'eth',
}

const getTokenLogoURL = memoize(
  (token?: Token) => {
    if (token && mapping[token.chainId]) {
      const { chainId } = token
      const tokenAddress = getAddress(token.address)
      const trustWalletLogoUrl = `https://assets-cdn.trustwallet.com/blockchains/${
        mapping[chainId]
      }/assets/${getAddress(token.address)}/logo.png`

      const logoUrl = `https://tokens.pancakeswap.finance/images/${
        chainId === ChainId.BSC ? '' : `${chainName[chainId]}/`
      }${tokenAddress}.png`

      return [logoUrl, trustWalletLogoUrl].find((url) => Boolean(url))
    }
    return null
  },
  (t) => `${t.chainId}#${t.address}`,
)

export const getTokenLogoURLByAddress = memoize(
  (address?: string, chainId?: number) => {
    if (address && chainId && mapping[chainId]) {
      return `https://assets-cdn.trustwallet.com/blockchains/${mapping[chainId]}/assets/${getAddress(address)}/logo.png`
    }
    return null
  },
  (address, chainId) => `${chainId}#${address}`,
)

export default getTokenLogoURL
