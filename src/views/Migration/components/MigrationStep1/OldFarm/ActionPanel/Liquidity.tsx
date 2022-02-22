import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Flex, Text, HelpIcon, useTooltip } from '@pancakeswap/uikit'
import { LiquidityProps } from '../Cells/Liquidity'

const Containter = styled(Flex)`
  margin-top: 12px;
  padding: 0;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0 12px;
  }
`

const ReferenceElement = styled.div`
  display: inline-block;
  align-self: center;
`

const LiquidityWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text};
  min-width: 110px;
  align-self: center;
  text-align: right;
  margin-right: 6px;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-right: 0;
  }
`

const Liquidity: React.FC<LiquidityProps> = ({ liquidity }) => {
  const { t } = useTranslation()
  const displayLiquidity =
    liquidity && liquidity.gt(0)
      ? `$${Number(liquidity).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : '$0'
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Total value of the funds in this farm’s liquidity pool'),
    { placement: 'top-end', tooltipOffset: [20, 10] },
  )

  return (
    <Containter justifyContent="space-between">
      <Text>{t('Liquidity')}</Text>
      <Flex>
        <LiquidityWrapper>
          <Text>{displayLiquidity}</Text>
        </LiquidityWrapper>
        <ReferenceElement ref={targetRef}>
          <HelpIcon color="textSubtle" />
        </ReferenceElement>
        {tooltipVisible && tooltip}
      </Flex>
    </Containter>
  )
}

export default Liquidity
