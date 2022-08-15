import styled from 'styled-components'
import { HelpIcon, Text, Skeleton, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'

const ReferenceElement = styled.div`
  display: inline-block;
`

export interface LiquidityProps {
  liquidity: BigNumber
}

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

const Container = styled.div`
  display: flex;
  align-items: center;
`

const Liquidity: React.FunctionComponent<React.PropsWithChildren<LiquidityProps>> = ({ liquidity }) => {
  const displayLiquidity =
    liquidity && liquidity.gt(0) ? (
      `$${Number(liquidity).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    ) : (
      <Skeleton width={60} />
    )
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Total value of the funds in this farm’s liquidity pool'),
    { placement: 'top-end', tooltipOffset: [20, 10] },
  )

  return (
    <Container>
      <LiquidityWrapper>
        <Text>{displayLiquidity}</Text>
      </LiquidityWrapper>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </Container>
  )
}

export default Liquidity
