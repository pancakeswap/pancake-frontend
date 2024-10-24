import { ChainId } from '@pancakeswap/chains'
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

const MigrationFarmStep: React.FC<React.PropsWithChildren<{ step: number }>> = ({ step }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { data: farmsLP, userDataLoaded } = useFarms()

  const cakePrice = useCakePrice()
  const { chainId } = useActiveChainId()

  usePollFarmsWithUserData()

  const userDataReady = !account || (!!account && userDataLoaded)

  const stakedOrHasTokenBalance = useMemo(() => {
    const farms = farmsLP
      .filter((farm) => farm.pid !== 0)
      .filter((farm) => Boolean(farm?.bCakeWrapperAddress))
      .filter((farm) => farm.pid !== 11 && farm.token.serialize.chainId !== ChainId.ETHEREUM)

    return farms.filter((farm) => {
      return (
        (farm.userData &&
          (new BigNumber(farm.userData.stakedBalance).isGreaterThan(-1) ||
            new BigNumber(farm.userData.tokenBalance).isGreaterThan(-1))) ||
        new BigNumber(farm.userData?.proxy?.stakedBalance ?? 0).isGreaterThan(-1)
      )
    })
  }, [farmsLP])

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
        step={step}
      />
      <PosManagerMigrationFarmTable
        title={t('Position Managers')}
        noStakedFarmText={t('You are not currently staking in any farms that require migrations.')}
        account={account ?? '0x'}
        columnSchema={V3Step1DesktopColumnSchema}
        farms={chosenFarmsMemoized}
        userDataReady={userDataReady}
        step={step}
      />
    </>
  )
}

export default MigrationFarmStep
