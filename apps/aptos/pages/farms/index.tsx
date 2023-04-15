import { useContext } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { FarmsPageLayout, FarmsContext } from 'components/Farms/components/index'
import FarmCard from 'components/Farms/components/FarmCard/FarmCard'
import { ethersToBigNumber } from '@pancakeswap/utils/bigNumber'
import { usePriceCakeUsdc } from 'hooks/useStablePrice'
import { useFarms } from 'state/farms/hook'
import { getDisplayApr } from 'components/Farms/components/getDisplayApr'
import { getDisplayFarmCakePerSecond } from 'components/Farms/components/getDisplayFarmCakePerSecond'
import { FarmWithStakedValue } from '@pancakeswap/farms'

const FarmsPage = () => {
  const { account } = useActiveWeb3React()
  const { chosenFarmsMemoized } = useContext(FarmsContext)
  const cakePrice = usePriceCakeUsdc()

  const { totalRegularAllocPoint, cakePerBlock } = useFarms()

  const totalMultipliers = totalRegularAllocPoint
    ? (ethersToBigNumber(totalRegularAllocPoint).toNumber() / 100).toString()
    : '-'

  return (
    <>
      {chosenFarmsMemoized?.map((farm: FarmWithStakedValue) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr) as string}
          cakePrice={cakePrice}
          account={account}
          removed={false}
          farmCakePerSecond={getDisplayFarmCakePerSecond(
            farm.allocPoint?.toNumber(),
            totalRegularAllocPoint,
            cakePerBlock,
          )}
          totalMultipliers={totalMultipliers}
        />
      ))}
    </>
  )
}

FarmsPage.Layout = FarmsPageLayout

export default FarmsPage
