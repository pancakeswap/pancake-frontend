import { useContext } from 'react'
import { SUPPORT_FARMS } from 'config/constants/supportChains'
import { FarmsV3PageLayout, FarmsV3Context } from 'views/Farms'
import { ethersToBigNumber } from '@pancakeswap/utils/bigNumber'
import { FarmV3Card } from 'views/Farms/components/FarmCard/V3/FarmV3Card'
import { getDisplayApr } from 'views/Farms/components/getDisplayApr'
import { usePriceCakeUSD, useFarms } from 'state/farms/hooks'
import { useFarmsV3Public } from 'state/farmsV3/hooks'
import { useAccount } from 'wagmi'
import FarmCard from 'views/Farms/components/FarmCard/FarmCard'
import ProxyFarmContainer, {
  YieldBoosterStateContext,
} from 'views/Farms/components/YieldBooster/components/ProxyFarmContainer'
import { ethers } from 'ethers'

export const ProxyFarmCardContainer = ({ farm, farmCakePerSecond = null, totalMultipliers = null }) => {
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
      farmCakePerSecond={farmCakePerSecond}
      totalMultipliers={totalMultipliers}
    />
  )
}

const FarmsPage = () => {
  const { address: account } = useAccount()
  const { chosenFarmsMemoized } = useContext(FarmsV3Context)
  const cakePrice = usePriceCakeUSD()
  const { regularCakePerBlock: cakePerBlock, totalRegularAllocPoint } = useFarms()

  const totalMultipliers = totalRegularAllocPoint
    ? (ethersToBigNumber(totalRegularAllocPoint).toNumber() / 10).toString()
    : '-'

  const { data: farmV3 } = useFarmsV3Public()
  const { totalAllocPoint, cakePerSecond } = farmV3
  const totalMultipliersV3 = totalAllocPoint ? (ethersToBigNumber(totalAllocPoint).toNumber() / 10).toString() : '-'

  return (
    <>
      {chosenFarmsMemoized?.map((farm) => {
        if (farm.version === 2) {
          const farmCakePerSecondNum =
            farm.poolWeight && cakePerSecond
              ? (Number(farm.poolWeight) * Number(ethers.utils.parseEther(cakePerBlock.toString()))) / 1e18 / 3
              : 0

          const farmCakePerSecond =
            farmCakePerSecondNum === 0
              ? '0'
              : farmCakePerSecondNum < 0.000001
              ? '<0.000001'
              : `~${farmCakePerSecondNum.toFixed(6)}`

          return farm.boosted ? (
            <ProxyFarmContainer farm={farm} key={`${farm.pid}-${farm.version}`}>
              <ProxyFarmCardContainer
                farm={farm}
                farmCakePerSecond={farmCakePerSecond}
                totalMultipliers={totalMultipliers}
              />
            </ProxyFarmContainer>
          ) : (
            <FarmCard
              key={`${farm.pid}-${farm.version}`}
              farm={farm}
              displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr)}
              cakePrice={cakePrice}
              account={account}
              removed={false}
              farmCakePerSecond={farmCakePerSecond}
              totalMultipliers={totalMultipliers}
            />
          )
        }

        // V3
        const farmCakePerSecond = farm.poolWeight && cakePerSecond ? Number(farm.poolWeight) * Number(cakePerSecond) : 0

        return (
          <FarmV3Card
            key={`${farm.pid}-${farm.version}`}
            farm={farm}
            cakePrice={cakePrice}
            account={account}
            removed={false}
            farmCakePerSecond={
              farmCakePerSecond === 0
                ? '0'
                : farmCakePerSecond < 0.000001
                ? '<0.000001'
                : `~${farmCakePerSecond.toFixed(6)}`
            }
            totalMultipliers={totalMultipliersV3}
          />
        )
      })}
    </>
  )
}

FarmsPage.Layout = FarmsV3PageLayout

FarmsPage.chains = SUPPORT_FARMS

export default FarmsPage
