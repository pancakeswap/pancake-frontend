import { SUPPORT_FARMS } from 'config/constants/supportChains'
import { useCakePrice } from 'hooks/useCakePrice'
import { useContext } from 'react'
import { FarmsV3Context, FarmsV3PageLayout } from 'views/Farms'
import FarmCard from 'views/Farms/components/FarmCard/FarmCard'
import { FarmV3Card } from 'views/Farms/components/FarmCard/V3/FarmV3Card'
import ProxyFarmContainer from 'views/Farms/components/YieldBooster/components/ProxyFarmContainer'
import { getDisplayApr } from 'views/Farms/components/getDisplayApr'
import { useAccount } from 'wagmi'
import { ProxyFarmCardContainer } from '.'

const FarmsHistoryPage = () => {
  const { address: account } = useAccount()
  const { chosenFarmsMemoized } = useContext(FarmsV3Context)
  const cakePrice = useCakePrice()

  return (
    <>
      {chosenFarmsMemoized?.map((farm) => {
        if (farm.version === 2) {
          return farm.boosted ? (
            <ProxyFarmContainer farm={farm} key={farm.pid}>
              <ProxyFarmCardContainer farm={farm} />
            </ProxyFarmContainer>
          ) : (
            <FarmCard
              key={farm.pid}
              farm={farm}
              displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr)}
              cakePrice={cakePrice}
              account={account}
              removed={false}
            />
          )
        }
        return <FarmV3Card key={farm.pid} farm={farm} cakePrice={cakePrice} account={account} removed={false} />
      })}
    </>
  )
}

FarmsHistoryPage.Layout = FarmsV3PageLayout
FarmsHistoryPage.chains = SUPPORT_FARMS

export default FarmsHistoryPage
