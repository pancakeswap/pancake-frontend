import { DeserializedFarm, FarmWithStakedValue } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import { CAKE_PER_YEAR } from 'config'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCakePrice } from 'hooks/useCakePrice'
import React, { useCallback, useMemo } from 'react'
import { useFarms, usePollFarmsWithUserData } from 'state/farms/hooks'
import { getFarmApr } from 'utils/apr'
import { useAccount } from 'wagmi'
import MigrationFarmTable from '../MigrationFarmTable'
import { V3Step1DesktopColumnSchema } from '../types'
import { PosManagerMigrationFarmTable } from './PositionManagerTable'

const OldFarmStep1: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { data: farmsLP, userDataLoaded } = useFarms()

  const cakePrice = useCakePrice()
  const { chainId } = useActiveChainId()

  usePollFarmsWithUserData()

  const userDataReady = !account || (!!account && userDataLoaded)

  const farms = farmsLP
    .filter((farm) => farm.pid !== 0)
    .filter((farm) => {
      return Boolean(farm?.bCakeWrapperAddress)
    })

  const stakedOrHasTokenBalance = farms.filter((farm) => {
    return (
      (farm.userData &&
        (new BigNumber(farm.userData.stakedBalance).isGreaterThan(-1) ||
          new BigNumber(farm.userData.tokenBalance).isGreaterThan(-1))) ||
      (farm.userData?.proxy?.stakedBalance && new BigNumber(farm.userData.proxy.stakedBalance).isGreaterThan(0))
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
          new BigNumber(farm?.poolWeight ?? 0),
          cakePrice,
          totalLiquidity,
          farm.lpAddress,
          CAKE_PER_YEAR,
          farm.lpRewardsApr,
        )
        return { ...farm, apr: cakeRewardsApr ?? undefined, lpRewardsApr, liquidity: totalLiquidity }
      })

      return farmsToDisplayWithAPR
    },
    [cakePrice, chainId],
  )

  const chosenFarmsMemoized = useMemo(() => {
    return userDataReady ? farmsList(stakedOrHasTokenBalance) : []
  }, [stakedOrHasTokenBalance, farmsList, userDataReady])

  return (
    <>
      <MigrationFarmTable
        title={t('V2/SS Farms')}
        noStakedFarmText={t('You are not currently staking in any farms that require migrations.')}
        account={account ?? '0x'}
        columnSchema={V3Step1DesktopColumnSchema}
        farms={chosenFarmsMemoized}
        userDataReady={userDataReady}
      />
      <PosManagerMigrationFarmTable
        title={t('Position Managers')}
        noStakedFarmText={t('You are not currently staking in any farms that require migrations.')}
        account={account ?? '0x'}
        columnSchema={V3Step1DesktopColumnSchema}
        farms={chosenFarmsMemoized}
        userDataReady={userDataReady}
        step={1}
      />
    </>
  )
}

export default OldFarmStep1
