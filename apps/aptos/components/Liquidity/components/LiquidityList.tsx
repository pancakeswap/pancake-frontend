import { LoadingDot } from '@pancakeswap/uikit'
import { Liquidity as LiquidityUI } from '@pancakeswap/widgets-internal'
import useLPPairsHaveBalance from 'components/Liquidity/hooks/useLPPairsHaveBalance'
import withLPValues from '../hocs/withLPValues'
import { FullPositionCard } from './PositionCard'

const { NoLiquidity } = LiquidityUI

const FullPositionCardContainer = withLPValues(FullPositionCard)

export default function LiquidityList() {
  const { data: tokenPairs, loading } = useLPPairsHaveBalance()

  if (loading) {
    return <LoadingDot />
  }

  if (!tokenPairs?.length) {
    return (
      <>
        <NoLiquidity />
        {/* <FindOtherLP /> */}
      </>
    )
  }

  return (
    <>
      {tokenPairs.map((v2Pair, index) => (
        <FullPositionCardContainer
          key={v2Pair?.liquidityToken?.address}
          pair={v2Pair}
          mb={index < tokenPairs.length - 1 ? '16px' : '0'}
        />
      ))}
      {/* <FindOtherLP /> */}
    </>
  )
}
