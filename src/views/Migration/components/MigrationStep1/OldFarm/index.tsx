import React, { useMemo, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getFarmApr } from 'utils/apr'
import { RowType } from '@pancakeswap/uikit'
import { ChainId } from '@pancakeswap/sdk'
import { useFarms, usePriceCakeBusd, usePollFarmsWithUserData } from 'state/farms/hooks'
import { DeserializedFarm } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import isArchivedPid from 'utils/farmHelpers'
import OldFarm from './FarmTable'
import { RowProps } from './FarmRow'
import { DesktopColumnSchema } from '../../types'

const OldFarmStep1: React.FC = () => {
  const { account } = useWeb3React()
  const { data: farmsLP, userDataLoaded } = useFarms()
  const cakePrice = usePriceCakeBusd()

  usePollFarmsWithUserData(false)

  const userDataReady = !account || (!!account && userDataLoaded)

  const activeFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier !== '0X' && !isArchivedPid(farm.pid))
  const inactiveFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier === '0X' && !isArchivedPid(farm.pid))

  const stakedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )
  const stakedInactiveFarms = inactiveFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const farmsList = useCallback(
    (farmsToDisplay: DeserializedFarm[]): FarmWithStakedValue[] => {
      const farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteTokenPriceBusd) {
          return farm
        }
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteTokenPriceBusd)
        const { cakeRewardsApr, lpRewardsApr } = getFarmApr(
          new BigNumber(farm.poolWeight),
          cakePrice,
          totalLiquidity,
          farm.lpAddresses[ChainId.MAINNET],
        )
        return { ...farm, apr: cakeRewardsApr, lpRewardsApr, liquidity: totalLiquidity }
      })

      return farmsToDisplayWithAPR
    },
    [cakePrice],
  )

  const chosenFarmsMemoized = useMemo(() => {
    return farmsList(stakedOnlyFarms)
  }, [stakedOnlyFarms, farmsList])

  const rowData = chosenFarmsMemoized.map((farm) => {
    const lpLabel = farm.lpSymbol && farm.lpSymbol.split(' ')[0].toUpperCase().replace('PANCAKE', '')

    const row: RowProps = {
      farm: {
        label: lpLabel,
        pid: farm.pid,
        token: farm.token,
        quoteToken: farm.quoteToken,
      },
      staked: {
        label: lpLabel,
        pid: farm.pid,
      },
      earned: {
        earnings: getBalanceNumber(new BigNumber(farm.userData.earnings)),
        pid: farm.pid,
      },
      liquidity: {
        liquidity: farm.liquidity,
      },
      multiplier: {
        multiplier: farm.multiplier,
      },
      unstake: {
        pid: farm.pid,
      },
    }

    return row
  })

  const renderContent = (): JSX.Element => {
    const columnSchema = DesktopColumnSchema
    const columns = columnSchema.map((column) => ({
      id: column.id,
      name: column.name,
      label: column.label,
      sort: (a: RowType<RowProps>, b: RowType<RowProps>) => {
        switch (column.name) {
          case 'farm':
            return b.id - a.id
          default:
            return 1
        }
      },
    }))

    return <OldFarm account={account} data={rowData} columns={columns} userDataReady={userDataReady} />
  }

  return <>{renderContent()}</>
}

export default OldFarmStep1
