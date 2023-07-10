import { DeserializedFarm, FarmWithStakedValue } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { useCakePriceAsBN } from 'hooks/useCakePriceAsBN'
import BigNumber from 'bignumber.js'
import { CAKE_PER_YEAR } from 'config'
import { useActiveChainId } from 'hooks/useActiveChainId'
import React, { useCallback, useMemo } from 'react'
import { useFarms, usePollFarmsWithUserData } from 'state/farms/hooks'
import { useFarmsV3Public } from 'state/farmsV3/hooks'
import { getFarmApr } from 'utils/apr'
import { useAccount } from 'wagmi'
import MigrationFarmTable from '../MigrationFarmTable'
import { V3Step1DesktopColumnSchema } from '../types'
import { STABLE_LP_TO_MIGRATE } from './Step2'

const OldFarmStep1: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { data: farmsLP, userDataLoaded } = useFarms()
  const {
    data: { farmsWithPrice },
  } = useFarmsV3Public()
  const cakePrice = useCakePriceAsBN()
  const { chainId } = useActiveChainId()

  usePollFarmsWithUserData()

  const userDataReady = !account || (!!account && userDataLoaded)

  const farms = farmsLP
    .filter((farm) => farm.pid !== 0)
    .filter((farm) => {
      if (STABLE_LP_TO_MIGRATE.includes(farm.lpAddress)) return true
      return farmsWithPrice
        .filter((f) => f.multiplier !== '0X')
        .find(
          (farmV3) =>
            (farmV3.quoteToken.address === farm.quoteToken.address && farmV3.token.address === farm.token.address) ||
            (farmV3.quoteToken.address === farm.token.address && farmV3.token.address === farm.quoteToken.address),
        )
    })

  const stakedOrHasTokenBalance = farms.filter((farm) => {
    return (
      (farm.userData &&
        (new BigNumber(farm.userData.stakedBalance).isGreaterThan(0) ||
          new BigNumber(farm.userData.tokenBalance).isGreaterThan(0))) ||
      new BigNumber(farm.userData.proxy?.stakedBalance).isGreaterThan(0)
    )
  })

  const farmsList = useCallback(
    (farmsToDisplay: DeserializedFarm[]): FarmWithStakedValue[] => {
      const farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteTokenPriceBusd) {
          return farm
        }
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteTokenPriceBusd)
        const { cakeRewardsApr, lpRewardsApr } = getFarmApr(
          chainId,
          new BigNumber(farm.poolWeight),
          cakePrice,
          totalLiquidity,
          farm.lpAddress,
          CAKE_PER_YEAR,
        )
        return { ...farm, apr: cakeRewardsApr, lpRewardsApr, liquidity: totalLiquidity }
      })

      return farmsToDisplayWithAPR
    },
    [cakePrice, chainId],
  )

  const chosenFarmsMemoized = useMemo(() => {
    return userDataReady ? farmsList(stakedOrHasTokenBalance) : []
  }, [stakedOrHasTokenBalance, farmsList, userDataReady])

  return (
    <MigrationFarmTable
      title={t('Old Farms')}
      noStakedFarmText={t('You are not currently staking in any farms that require migrations.')}
      account={account}
      columnSchema={V3Step1DesktopColumnSchema}
      farms={chosenFarmsMemoized}
      userDataReady={userDataReady}
    />
  )
}

export default OldFarmStep1
