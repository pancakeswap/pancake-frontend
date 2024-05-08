import { Currency } from '@pancakeswap/sdk'
import { Box, Flex } from '@pancakeswap/uikit'
import { CurrencyLogo } from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import { styled } from 'styled-components'

const TokenWithChainContainer = styled(Flex)<{ $width: number; $height: number }>`
  position: relative;
  z-index: 2;
  cursor: pointer;
  width: ${($width) => `${$width}px`};
  height: ${($height) => `${$height}px`};
`

const StyleNetwork = styled(Flex)`
  position: absolute;
  bottom: 0px;
  left: 20px;
  z-index: 3;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  overflow: hidden;
  background-size: contain;
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
      <StyleNetwork style={{ backgroundImage: `url(${ASSET_CDN}/web/chains/${currency?.chainId}.png)` }} />
    </TokenWithChainContainer>
  )
}
