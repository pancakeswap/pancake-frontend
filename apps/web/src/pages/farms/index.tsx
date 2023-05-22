import { useContext } from 'react'
import { SUPPORT_FARMS } from 'config/constants/supportChains'
import { FarmsV3PageLayout, FarmsV3Context } from 'views/Farms'
import { FarmV3Card } from 'views/Farms/components/FarmCard/V3/FarmV3Card'
import { getDisplayApr } from 'views/Farms/components/getDisplayApr'
import { usePriceCakeUSD } from 'state/farms/hooks'
import { useAccount } from 'wagmi'
import FarmCard from 'views/Farms/components/FarmCard/FarmCard'
import ProxyFarmContainer, {
  YieldBoosterStateContext,
} from 'views/Farms/components/YieldBooster/components/ProxyFarmContainer'

export const ProxyFarmCardContainer = ({ farm }) => {
  const { address: account } = useAccount()
  const cakePrice = usePriceCakeUSD()

  const { proxyFarm, shouldUseProxyFarm } = useContext(YieldBoosterStateContext)
  const finalFarm = shouldUseProxyFarm ? proxyFarm : farm

  return (
    <FarmCard
      key={finalFarm.pid}
      farm={finalFarm}
      displayApr={getDisplayApr(finalFarm.apr, finalFarm.lpRewardsApr)}
      cakePrice={cakePrice}
      account={account}
      removed={false}
    />
  )
}

const FarmsPage = () => {
  const { address: account } = useAccount()
  const { chosenFarmsMemoized } = useContext(FarmsV3Context)
  const cakePrice = usePriceCakeUSD()

  return (
    <>
      {chosenFarmsMemoized?.map((farm) => {
        if (farm.version === 2) {
          return farm.boosted ? (
            <ProxyFarmContainer farm={farm} key={`${farm.pid}-${farm.version}`}>
              <ProxyFarmCardContainer farm={farm} />
            </ProxyFarmContainer>
          ) : (
            <FarmCard
              key={`${farm.pid}-${farm.version}`}
              farm={farm}
              displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr)}
              cakePrice={cakePrice}
              account={account}
              removed={false}
            />
          )
        }

        return (
          <FarmV3Card
            key={`${farm.pid}-${farm.version}`}
            farm={farm}
            cakePrice={cakePrice}
            account={account}
            removed={false}
          />
        )
      })}
    </>
  )
}

FarmsPage.Layout = FarmsV3PageLayout

FarmsPage.chains = SUPPORT_FARMS

export default FarmsPage
