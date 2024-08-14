import BigNumber from 'bignumber.js'
import { memo, useMemo } from 'react'
import { getPoolAddressByToken, useExtraV3PositionInfo, usePoolInfo } from 'state/farmsV4/hooks'
import { PositionDetail } from 'state/farmsV4/state/accountPositions/type'
import { useTotalPriceUSD } from 'views/universalFarms/hooks/useTotalPriceUSD'
import { V3PositionActions } from '../PositionActions/V3PositionActions'
import { V3UnstakeModalContent } from '../PositionActions/V3UnstakeModalContent'
import { PositionItem } from './PositionItem'
import { PriceRange } from './PriceRange'

type V3PositionItemProps = {
  data: PositionDetail
  detailMode?: boolean
  fee24h?: `${number}`
  liquidity?: bigint
}

export const V3PositionItem = memo(({ data, detailMode, fee24h, liquidity }: V3PositionItemProps) => {
  const { currency0, currency1, removed, outOfRange, priceUpper, priceLower, tickAtLimit, position } =
    useExtraV3PositionInfo(data)
  const userLpApr = useMemo(() => {
    if (!fee24h || !data.isStaked) return undefined
    if (outOfRange || !data.farmingLiquidity || removed || !liquidity) return 0
    const userTVL = data.farmingLiquidity
    const totalTVL = liquidity
    const rewardPerDayUSD = Number(fee24h)
    return new BigNumber(rewardPerDayUSD)
      .times(100)
      .times(365)
      .times(userTVL.toString())
      .div(totalTVL.toString())
      .toNumber()
  }, [data.farmingLiquidity, data.isStaked, fee24h, liquidity, outOfRange, removed])

  const poolAddress = getPoolAddressByToken(data.chainId, data.token0, data.token1, data.fee)
  const pool = usePoolInfo({ poolAddress, chainId: data.chainId })

  const totalPriceUSD = useTotalPriceUSD({
    currency0,
    currency1,
    amount0: position?.amount0,
    amount1: position?.amount1,
  })

  const desc =
    currency1 && currency0 ? (
      <PriceRange
        currency0={currency0}
        currency1={currency1}
        priceLower={priceLower}
        priceUpper={priceUpper}
        tickAtLimit={tickAtLimit}
      />
    ) : null

  return (
    <PositionItem
      chainId={data.chainId}
      link={`/liquidity/${data.tokenId}`}
      pool={pool}
      totalPriceUSD={totalPriceUSD}
      amount0={position?.amount0}
      amount1={position?.amount1}
      desc={desc}
      currency0={currency0}
      currency1={currency1}
      removed={removed}
      outOfRange={outOfRange}
      fee={data.fee}
      protocol={data.protocol}
      isStaked={data.isStaked}
      tokenId={data.tokenId}
      detailMode={detailMode}
      boosterMultiplier={data.farmingMultiplier}
      userLpApr={userLpApr}
    >
      {currency0 && currency1 ? (
        <V3PositionActions
          currency0={currency0}
          currency1={currency1}
          isStaked={data.isStaked}
          removed={removed}
          outOfRange={outOfRange}
          tokenId={data.tokenId}
          fee={data.fee}
          detailMode={detailMode}
          modalContent={
            <V3UnstakeModalContent
              chainId={data.chainId}
              link={`/liquidity/${data.tokenId}`}
              pool={pool}
              totalPriceUSD={totalPriceUSD}
              amount0={position?.amount0}
              amount1={position?.amount1}
              desc={desc}
              currency0={currency0}
              currency1={currency1}
              removed={removed}
              outOfRange={outOfRange}
              fee={data.fee}
              protocol={data.protocol}
              isStaked={data.isStaked}
              tokenId={data.tokenId}
              detailMode={detailMode}
            />
          }
        />
      ) : null}
    </PositionItem>
  )
})
