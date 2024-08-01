import { ChainId } from '@pancakeswap/chains'
import { Currency } from '@pancakeswap/sdk'
import {
  HelpIcon,
  ImageProps,
  TokenImage as UIKitTokenImage,
  TokenPairImage as UIKitTokenPairImage,
  TokenPairImageProps as UIKitTokenPairImageProps,
} from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import { useState } from 'react'

interface TokenPairImageProps extends Omit<UIKitTokenPairImageProps, 'primarySrc' | 'secondarySrc'> {
  primaryToken: Currency
  secondaryToken: Currency
}

export const tokenImageChainNameMapping: { [key: string]: string } = {
  [ChainId.BSC]: '',
  [ChainId.ETHEREUM]: 'eth/',
  [ChainId.POLYGON_ZKEVM]: 'polygon-zkevm/',
  [ChainId.ZKSYNC]: 'zksync/',
  [ChainId.ARBITRUM_ONE]: 'arbitrum/',
  [ChainId.LINEA]: 'linea/',
  [ChainId.BASE]: 'base/',
  [ChainId.OPBNB]: 'opbnb/',
}

export const getImageUrlFromToken = (token: Currency) => {
  const address = token?.isNative ? token.wrapped.address : token.address

  return token?.isNative && token.chainId !== ChainId.BSC
    ? `${ASSET_CDN}/web/native/${token.chainId}.png`
    : `https://tokens.pancakeswap.finance/images/${tokenImageChainNameMapping[token.chainId]}${address}.png`
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

interface TokenImageProps extends ImageProps {
  token: Currency
}

export const TokenImage: React.FC<React.PropsWithChildren<TokenImageProps>> = ({ token, ...props }) => {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return <HelpIcon width={props?.width ?? 20} height={props?.height ?? 20} />
  }

  return <UIKitTokenImage src={getImageUrlFromToken(token)} onError={() => setHasError(true)} {...props} />
}
