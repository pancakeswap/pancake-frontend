import { memo } from 'react'
import { getPoolAddressByToken, useExtraV3PositionInfo, usePoolInfo } from 'state/farmsV4/hooks'
import { PositionDetail } from 'state/farmsV4/state/accountPositions/type'
import { useTotalPriceUSD } from 'views/universalFarms/hooks/useTotalPriceUSD'
import { PositionItem } from './PositionItem'
import { PriceRange } from './PriceRange'

type V3PositionItemProps = {
  data: PositionDetail
  detailMode?: boolean
}

export const V3PositionItem = memo(({ data, detailMode }: V3PositionItemProps) => {
  const { currency0, currency1, removed, outOfRange, priceUpper, priceLower, tickAtLimit, position } =
    useExtraV3PositionInfo(data)

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
      data={data}
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
  )
})
