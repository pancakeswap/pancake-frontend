import React from 'react'
import styled from 'styled-components'
import { Flex, HelpIcon, Text, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'

import BaseCell, { CellContent } from 'views/Pools/components/PoolsTable/Cells/BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 100px;
`

const ReferenceElement = styled.div`
  display: inline-block;
`

const LiquidityWrapper = styled.div`
  min-width: 110px;
  font-weight: 600;
  text-align: right;
  margin-right: 14px;

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    margin-right: 0;
  }
`

export interface LiquidityProps {
  liquidity: BigNumber
}

const Liquidity: React.FC<LiquidityProps> = ({ liquidity }) => {
  const { t } = useTranslation()
  const displayLiquidity =
    liquidity && liquidity.gt(0)
      ? `$${Number(liquidity).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : `$0`
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Total value of the funds in this farm’s liquidity pool'),
    { placement: 'top-end', tooltipOffset: [20, 10] },
  )

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Liquidity')}
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
      </CellContent>
    </StyledCell>
  )
}

export default Liquidity
