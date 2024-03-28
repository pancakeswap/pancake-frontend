import { Currency } from '@pancakeswap/sdk'
import { AutoRenewIcon, Box } from '@pancakeswap/uikit'
import { memo } from 'react'
import { styled } from 'styled-components'

import { TokenPairImage } from 'components/TokenImage'

const TokenPairComp = styled(TokenPairImage)`
  z-index: 1;
`

const Container = styled(Box)`
  position: relative;
  width: 64px;
  height: 64px;
  display: block;
`

const AutoMark = styled(AutoRenewIcon).attrs({
  color: 'currenctColor',
  width: '20px',
  height: '20px',
})`
  padding: 0.15em;
  position: absolute;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.success};
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  z-index: 2;
`

interface Props {
  currencyA: Currency
  currencyB: Currency
  autoMark?: boolean
  width?: number
  height?: number
}

export const TokenPairLogos = memo(function TokenPairLogos({
  currencyA,
  currencyB,
  autoMark,
  width = 64,
  height = 64,
}: Props) {
  return (
    <Container style={{ width, height }}>
      <TokenPairComp
        variant="inverted"
        primaryToken={currencyA.wrapped}
        secondaryToken={currencyB.wrapped}
        width={width}
        height={height}
      />
      {autoMark && <AutoMark />}
    </Container>
  )
})
