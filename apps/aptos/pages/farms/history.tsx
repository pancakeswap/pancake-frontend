import { FarmWithStakedValue } from '@pancakeswap/farms'
import FarmCard from 'components/Farms/components/FarmCard/FarmCard'
import { getDisplayApr } from 'components/Farms/components/getDisplayApr'
import { FarmsContext, FarmsPageLayout } from 'components/Farms/components/index'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { usePriceCakeUsdc } from 'hooks/useStablePrice'
import { useContext } from 'react'

const FarmsHistoryPage = () => {
  const { account } = useActiveWeb3React()
  const { chosenFarmsMemoized } = useContext(FarmsContext)
  const cakePrice = usePriceCakeUsdc()

  return (
    <>
      {chosenFarmsMemoized?.map((farm: FarmWithStakedValue) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr, farm.dualTokenRewardApr) as string}
          cakePrice={cakePrice}
          account={account}
          removed
        />
      ))}
    </>
  )
}

FarmsHistoryPage.Layout = FarmsPageLayout

export default FarmsHistoryPage
