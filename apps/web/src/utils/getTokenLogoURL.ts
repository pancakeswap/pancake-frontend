import { getAddress } from '@ethersproject/address'
import memoize from 'lodash/memoize'
import { ChainId, Token } from '@pancakeswap/sdk'

const mapping = {
    [ChainId.BITGERT]: 'bitgert',
    [ChainId.DOGE]: 'doge',
    [ChainId.DOKEN]: 'doken',
    [ChainId.FUSE]: 'fuse',
    [ChainId.XDC]: 'xdc',
}

const getTokenLogoURL = memoize(
  (token?: Token) => {
    if (token && mapping[token.chainId]) {
      return `https://raw.githubusercontent.com/simone1999/trustwallet-assets/master/blockchains/${mapping[token.chainId]}/assets/${getAddress(
        token.address,
      )}/logo.png`
    }
    return null
  },
  (t) => `${t.chainId}#${t.address}`,
)

export default getTokenLogoURL
