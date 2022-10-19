import {
  TokenPairImage as UIKitTokenPairImage,
  TokenPairImageProps as UIKitTokenPairImageProps,
} from '@pancakeswap/uikit'
import { Token, ChainId } from '@pancakeswap/sdk'

interface TokenPairImageProps extends Omit<UIKitTokenPairImageProps, 'primarySrc' | 'secondarySrc'> {
  primaryToken: Token
  secondaryToken: Token
}

const getImageUrlFromToken = (token: Token) => {
  const address = token?.isNative ? token.wrapped.address : token.address
  if (token.chainId !== ChainId.BSC) {
    return `/images/${token.chainId}/tokens/${address}.png`
  }
  return `/images/tokens/${address}.png`
}

export const TokenPairImage: React.FC<React.PropsWithChildren<TokenPairImageProps>> = ({
  primaryToken,
  secondaryToken,
  ...props
}) => {
  return (
    <UIKitTokenPairImage
      primarySrc={getImageUrlFromToken(primaryToken)}
      secondarySrc={getImageUrlFromToken(secondaryToken)}
      {...props}
    />
  )
}

