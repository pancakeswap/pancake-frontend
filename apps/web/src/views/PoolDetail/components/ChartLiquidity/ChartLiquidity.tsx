import { Flex, Spinner } from '@pancakeswap/uikit'
import { ChartV3Liquidity } from './ChartV3Liquidity'
import { ChartLiquidityProps } from './type'

export const ChartLiquidity: React.FC<ChartLiquidityProps> = ({ address, poolInfo }) => {
  if (!poolInfo)
    return (
      <Flex mt="80px" justifyContent="center">
        <Spinner />
      </Flex>
    )
  return poolInfo.protocol === 'v3' ? (
    <ChartV3Liquidity address={address} poolInfo={poolInfo} />
  ) : (
    <ChartV2Liquidity address={address} poolInfo={poolInfo} />
  )
}

export const ChartV2Liquidity: React.FC<ChartLiquidityProps> = ({ address, poolInfo }) => {
  return (
    <Flex mt="80px" justifyContent="center">
      <Spinner />
    </Flex>
  )
}
