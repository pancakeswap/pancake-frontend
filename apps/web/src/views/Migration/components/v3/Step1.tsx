import { DeserializedFarm, FarmWithStakedValue } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import { CAKE_PER_YEAR } from 'config'
import { useActiveChainId } from 'hooks/useActiveChainId'
import React, { useCallback, useMemo } from 'react'
import { useFarms } from 'state/farms/hooks'
import { usePriceCakeBusd } from 'state/farmsV1/hooks'
import { useFarmsV3 } from 'state/farmsV3/hooks'
import { getFarmApr } from 'utils/apr'
import { useAccount } from 'wagmi'
import MigrationFarmTable from '../MigrationFarmTable'
import { V3Step1DesktopColumnSchema } from '../types'

const showV3FarmsOnly = false

const OldFarmStep1: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { data: farmsLP, userDataLoaded } = useFarms()
  const { farmsWithPrice } = useFarmsV3()
  const cakePrice = usePriceCakeBusd()
  const { chainId } = useActiveChainId()

  const userDataReady = !account || (!!account && userDataLoaded)

  const farms = farmsLP
    .filter((farm) => farm.pid !== 0)
    .filter((farm) => {
      if (showV3FarmsOnly) {
        return farmsWithPrice.find(
          (farmV3) =>
            (farmV3.quoteToken.address === farm.quoteToken.address && farmV3.token.address === farm.token.address) ||
            (farmV3.quoteToken.address === farm.token.address && farmV3.token.address === farm.quoteToken.address),
        )
      }
      return true
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
    return farmsList(stakedOrHasTokenBalance)
  }, [stakedOrHasTokenBalance, farmsList])

  return (
    <MigrationFarmTable
      title={t('Old Farms')}
      noStakedFarmText={t('You are not currently staking in any v1 farms.')}
      account={account}
      cakePrice={cakePrice}
      columnSchema={V3Step1DesktopColumnSchema}
      farms={chosenFarmsMemoized}
      userDataReady={userDataReady}
    />
  )
}

export default OldFarmStep1
