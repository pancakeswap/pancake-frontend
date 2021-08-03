import { useEffect, useState, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import multicall from 'utils/multicall'
import { getMasterChefAddress } from 'utils/addressHelpers'
import masterChefABI from 'config/abi/masterchef.json'
import { poolsConfig } from 'config/constants'
import { FarmConfig } from 'config/constants/types'
import useRefresh from 'hooks/useRefresh'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { useCakeVault, usePools } from 'state/pools/hooks'
import { fetchUserPendingRewards } from 'state/pools/fetchPoolsUser'
import { getBalanceAmount } from 'utils/formatBalance'

export interface FarmWithBalance extends FarmConfig {
  balance: BigNumber
}

const usePoolsWithBalance = () => {
  const [earningsSum, setEarningsSum] = useState<number>(null)
  const { account } = useWeb3React()
  const { pools } = usePools(account)

  const poolsWithRewardsBalance = useMemo(
    () =>
      pools.filter((pool) => {
        return pool.userData && new BigNumber(pool.userData.pendingReward).gt(0)
      }),
    [pools],
  )

  useEffect(() => {
    if (poolsWithRewardsBalance.length > 0) {
      console.log(poolsWithRewardsBalance)

      const totalEarned = poolsWithRewardsBalance.reduce((accum, pool) => {
        const earningNumber = new BigNumber(pool.userData.pendingReward)

        if (earningNumber.eq(0)) {
          return accum
        }

        debugger // eslint-disable-line

        return accum + getBalanceAmount(earningNumber, pool.earningToken.decimals).toNumber()
      }, 0)

      setEarningsSum(totalEarned)
    }
  }, [poolsWithRewardsBalance])

  return { poolsWithRewardsBalance, earningsSum }
}

export default usePoolsWithBalance
