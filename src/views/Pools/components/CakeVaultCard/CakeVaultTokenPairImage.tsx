import React from 'react'
import { TokenPairImage, ImageProps } from '@pancakeswap/uikit'
import tokens from 'config/constants/tokens'
import { getAddress } from 'utils/addressHelpers'

const CakeVaultTokenPairImage: React.FC<Omit<ImageProps, 'src'>> = (props) => {
  return (
    <TokenPairImage
      primaryTokenAddress={getAddress(tokens.cake.address)}
      secondaryTokenAddress="autorenew"
      secondaryImageProps={{
        imageFormat: 'svg',
      }}
      {...props}
    />
  )
}

export default CakeVaultTokenPairImage
