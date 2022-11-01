import { useContext } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { FarmsPageLayout, FarmsContext } from 'components/Farms/components/index'
import FarmCard from 'components/Farms/components/FarmCard/FarmCard'
import { useCakePriceAsBigNumber } from 'hooks/useStablePrice'
// import { getDisplayApr } from 'components/Farms/components/getDisplayApr'

const FarmsHistoryPage = () => {
  const { account } = useActiveWeb3React()
  const { chosenFarmsMemoized } = useContext(FarmsContext)
  const cakePrice = useCakePriceAsBigNumber()

  return (
    <>
      {chosenFarmsMemoized?.map((farm: any) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          displayApr="3"
          // displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr)}
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
