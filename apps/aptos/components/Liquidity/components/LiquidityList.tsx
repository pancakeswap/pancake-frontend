import { Liquidity as LiquidityUI } from '@pancakeswap/uikit'
import useLPPairsHaveBalance from 'components/Liquidity/hooks/useLPPairsHaveBalance'
import withLPValues from '../hocs/withLPValues'

const { LoadingDot, NoLiquidity, FullPositionCard } = LiquidityUI

const PositionCard = withLPValues(FullPositionCard)

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

  // Philip TODO: add userPoolBalance of each pair
  return (
    <>
      {tokenPairs.map((v2Pair, index) => (
        <PositionCard
          key={v2Pair?.liquidityToken?.address}
          pair={v2Pair}
          mb={index < tokenPairs.length - 1 ? '16px' : '0'}
        />
      ))}
      {/* <FindOtherLP /> */}
    </>
  )
}
