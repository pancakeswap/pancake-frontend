import { Token } from '@pancakeswap/sdk'
import { SerializedToken, WrappedTokenInfo } from '@pancakeswap/tokens'

export function serializeToken(token: Token): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
    projectLink: token.projectLink,
    logoURI: token instanceof WrappedTokenInfo ? token.logoURI : undefined,
  }
}

export function deserializeToken(serializedToken: SerializedToken): Token {
  if (serializedToken.logoURI) {
    return new WrappedTokenInfo(
      {
        chainId: serializedToken.chainId,
        address: serializedToken.address,
        decimals: serializedToken.decimals,
        symbol: serializedToken.symbol,
        name: serializedToken.name,
        logoURI: serializedToken.logoURI,
      },
      [],
    )
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
