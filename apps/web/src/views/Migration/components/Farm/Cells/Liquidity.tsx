import { Flex, HelpIcon, Text, useTooltip } from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'
import React from 'react'
import { styled } from 'styled-components'

import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'

const StyledCell = styled(Pool.BaseCell)`
  flex: 1 0 100px;
`

const ReferenceElement = styled.div`
  display: inline-block;
`

const LiquidityWrapper = styled.div`
  min-width: 110px;
  font-weight: 600;
  text-align: right;
  margin-right: 4px;

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    margin-right: 0;
  }
`

export interface LiquidityProps {
  liquidity: BigNumber
}

const Liquidity: React.FC<React.PropsWithChildren<LiquidityProps>> = ({ liquidity }) => {
  const { t } = useTranslation()
  const displayLiquidity =
    liquidity && liquidity.gt(0)
      ? `$${Number(liquidity).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : `$0`
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Total value of the funds in this farm’s liquidity pair'),
    { placement: 'top-end', tooltipOffset: [20, 10] },
  )

  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Total Staked')}
        </Text>
        <Flex mt="4px">
          <LiquidityWrapper>
            <Text>{displayLiquidity}</Text>
          </LiquidityWrapper>
          <ReferenceElement ref={targetRef}>
            <HelpIcon color="textSubtle" />
          </ReferenceElement>
          {tooltipVisible && tooltip}
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default Liquidity
