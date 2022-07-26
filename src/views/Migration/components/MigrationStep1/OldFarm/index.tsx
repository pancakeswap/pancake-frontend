import React, { useMemo, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getFarmApr } from 'utils/apr'
import { RowType } from '@pancakeswap/uikit'
import { ChainId } from '@pancakeswap/sdk'
import { CAKE_PER_YEAR } from 'config'
import { useFarmsV1, usePriceCakeBusd } from 'state/farmsV1/hooks'
import { DeserializedFarm } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'
import { FarmWithStakedValue } from 'views/Farms/components/types'
import OldFarm from './FarmTable'
import { RowProps } from './FarmRow'
import { DesktopColumnSchema } from '../../types'

const OldFarmStep1: React.FC = () => {
  const { account } = useWeb3React()
  const { data: farmsLP, userDataLoaded } = useFarmsV1()
  const cakePrice = usePriceCakeBusd()

  const userDataReady = !account || (!!account && userDataLoaded)

  const farms = farmsLP.filter((farm) => farm.pid !== 0)

  const stakedOrHasTokenBalance = farms.filter((farm) => {
    return (
      farm.userData &&
      (new BigNumber(farm.userData.stakedBalance).isGreaterThan(0) ||
        new BigNumber(farm.userData.tokenBalance).isGreaterThan(0))
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
          new BigNumber(farm.poolWeight),
          cakePrice,
          totalLiquidity,
          farm.lpAddresses[ChainId.BSC],
          CAKE_PER_YEAR,
        )
        return { ...farm, apr: cakeRewardsApr, lpRewardsApr, liquidity: totalLiquidity }
      })

      return farmsToDisplayWithAPR
    },
    [cakePrice],
  )

  const chosenFarmsMemoized = useMemo(() => {
    return farmsList(stakedOrHasTokenBalance)
  }, [stakedOrHasTokenBalance, farmsList])

  const rowData = chosenFarmsMemoized.map((farm) => {
    const lpLabel = farm.lpSymbol && farm.lpSymbol.split(' ')[0].toUpperCase().replace('PANCAKE', '')

    const row: RowProps = {
      farm: {
        ...farm,
        label: lpLabel,
        pid: farm.pid,
        token: farm.token,
        lpSymbol: farm.lpSymbol,
        quoteToken: farm.quoteToken,
      },
      staked: {
        label: lpLabel,
        pid: farm.pid,
        stakedBalance: farm.userData.stakedBalance,
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
    const columns = DesktopColumnSchema.map((column) => ({
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
