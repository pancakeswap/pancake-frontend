import { ChainId } from '@pancakeswap/chains'
import { Currency, Token } from '@pancakeswap/sdk'
import {
  ImageProps,
  TokenImage as UIKitTokenImage,
  TokenPairImage as UIKitTokenPairImage,
  TokenPairLogo as UIKitTokenPairLogo,
  TokenPairImageProps as UIKitTokenPairImageProps,
} from '@pancakeswap/uikit'
import uriToHttp from '@pancakeswap/utils/uriToHttp'
import { ASSET_CDN } from 'config/constants/endpoints'
import { useMemo } from 'react'

interface TokenPairImageProps extends Omit<UIKitTokenPairImageProps, 'primarySrc' | 'secondarySrc'> {
  primaryToken: Currency
  secondaryToken: Token
  withChainLogo?: boolean
}

export const tokenImageChainNameMapping = {
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
  const address = token?.isNative ? token.wrapped.address : token?.address

  return token
    ? token.isNative && token.chainId !== ChainId.BSC
      ? `${ASSET_CDN}/web/native/${token.chainId}.png`
      : `https://tokens.pancakeswap.finance/images/${tokenImageChainNameMapping[token.chainId]}${address}.png`
    : ''
}

export const getImageUrlsFromToken = (token: Currency & { logoURI?: string | undefined }) => {
  const uriLocations = token?.logoURI ? uriToHttp(token?.logoURI) : []
  const imageUri = getImageUrlFromToken(token)
  return [...uriLocations, imageUri]
}

export const getChainLogoUrlFromChainId = (chainId: number) =>
  `https://assets.pancakeswap.finance/web/chains/${chainId}.png`

export const TokenPairImage: React.FC<React.PropsWithChildren<TokenPairImageProps>> = ({
  primaryToken,
  secondaryToken,
  withChainLogo = false,
  ...props
}) => {
  const chainLogo = withChainLogo ? getChainLogoUrlFromChainId(primaryToken.chainId) : undefined
  return (
    <UIKitTokenPairImage
      primarySrc={getImageUrlFromToken(primaryToken)}
      secondarySrc={getImageUrlFromToken(secondaryToken)}
      chainLogoSrc={chainLogo}
      {...props}
    />
  )
}

export const TokenPairLogo: React.FC<React.PropsWithChildren<TokenPairImageProps>> = ({
  primaryToken,
  secondaryToken,
  withChainLogo = false,
  ...props
}) => {
  const chainLogo = useMemo(
    () => (withChainLogo ? [getChainLogoUrlFromChainId(primaryToken.chainId)] : []),
    [withChainLogo, primaryToken.chainId],
  )
  return (
    <UIKitTokenPairLogo
      primarySrcs={getImageUrlsFromToken(primaryToken)}
      secondarySrcs={getImageUrlsFromToken(secondaryToken)}
      chainLogoSrcs={chainLogo}
      {...props}
    />
  )
}

interface TokenImageProps extends ImageProps {
  token: Token
}

export const TokenImage: React.FC<React.PropsWithChildren<TokenImageProps>> = ({ token, ...props }) => {
  return <UIKitTokenImage src={getImageUrlFromToken(token)} {...props} />
}
