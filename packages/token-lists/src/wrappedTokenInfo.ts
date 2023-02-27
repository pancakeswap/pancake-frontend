import { SerializedToken, Token } from '@pancakeswap/swap-sdk-core'
import { TokenInfo, TokenList } from './types'

export interface SerializedWrappedToken extends SerializedToken {
  chainId: number
  address: string
  decimals: number
  symbol: string
  name?: string
  projectLink?: string
  logoURI?: string
}

/**
 * Token instances created from token info.
 */
export class WrappedTokenInfo extends Token {
  public readonly logoURI: string | undefined

  constructor(tokenInfo: TokenInfo) {
    super(tokenInfo.chainId, tokenInfo.address, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name)
    this.logoURI = tokenInfo.logoURI
  }

  public get serialize(): SerializedWrappedToken {
    return {
      address: this.address,
      chainId: this.chainId,
      decimals: this.decimals,
      symbol: this.symbol,
      name: this.name,
      projectLink: this.projectLink,
      logoURI: this.logoURI,
    }
  }
}

export type TokenAddressMap<TChainId extends number> = Readonly<{
  [chainId in TChainId]: Readonly<{
    [tokenAddress: string]: { token: WrappedTokenInfo; list: TokenList }
  }>
}>

export function deserializeToken(serializedToken: SerializedWrappedToken): Token {
  if (serializedToken.logoURI) {
    return new WrappedTokenInfo({
      chainId: serializedToken.chainId,
      address: serializedToken.address,
      decimals: serializedToken.decimals,
      symbol: serializedToken.symbol || 'Unknown',
      name: serializedToken.name || 'Unknown',
      logoURI: serializedToken.logoURI,
    })
  }
  return new Token(
    serializedToken.chainId,
    serializedToken.address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name,
    serializedToken.projectLink,
  )
}
