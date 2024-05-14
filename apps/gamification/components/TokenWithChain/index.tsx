import { Currency } from '@pancakeswap/swap-sdk-core'
import { Box, Flex } from '@pancakeswap/uikit'
import { CurrencyLogo } from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import { styled } from 'styled-components'

const TokenWithChainContainer = styled(Flex)<{ $width: number; $height: number }>`
  position: relative;
  z-index: 2;
  cursor: pointer;
  width: ${({ $width }) => `${$width}px`};
  height: ${({ $height }) => `${$height}px`};
`

const StyleNetwork = styled(Flex)<{ $size: number }>`
  position: absolute;
  bottom: 0px;
  z-index: 3;
  border-radius: 50%;
  overflow: hidden;
  background-repeat: no-repeat;
  background-size: contain;
  left: ${({ $size }) => `${$size / 1.6}px`};
  width: ${({ $size }) => `${$size / 2.28}px`};
  height: ${({ $size }) => `${$size / 2.28}px`};
`

interface TokenWithChainProps {
  currency: Currency
  width: number
  height: number
}

export const TokenWithChain: React.FC<TokenWithChainProps> = ({ currency, width, height }) => {
  return (
    <TokenWithChainContainer $width={width} $height={height}>
      <Box position="relative" zIndex={1} minWidth={width} height={height}>
        <CurrencyLogo currency={currency} size={`${width}px`} />
      </Box>
      <StyleNetwork
        $size={width}
        style={{ backgroundImage: `url(${ASSET_CDN}/web/chains/${currency?.chainId}.png)` }}
      />
    </TokenWithChainContainer>
  )
}
