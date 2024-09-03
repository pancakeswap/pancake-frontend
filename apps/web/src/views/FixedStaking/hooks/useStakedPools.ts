import { VaultKey } from '@pancakeswap/pools'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useOfficialsAndUserAddedTokens } from 'hooks/Tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useFixedStakingContract, useVaultPoolContract } from 'hooks/useContract'
import toNumber from 'lodash/toNumber'
import { useMemo } from 'react'
import { useSingleContractMultipleData } from 'state/multicall/hooks'
import { VaultPosition, getVaultPosition } from 'utils/cakePool'
import { getAddress } from 'viem'
import { useAccount } from 'wagmi'

import { useActiveChainId } from 'hooks/useActiveChainId'
import { useReadContract } from '@pancakeswap/wagmi'
import { safeGetAddress } from 'utils'
import { DISABLED_POOLS } from '../constant'
import { FixedStakingPool, StakedPosition } from '../type'

export function useCurrentDay(): number {
  const fixedStakingContract = useFixedStakingContract()

  const { chainId } = useActiveChainId()

  const { data } = useReadContract({
    abi: fixedStakingContract.abi,
    address: fixedStakingContract.address as `0x${string}`,
    functionName: 'getCurrentDay',
    query: {
      enabled: true,
    },
    chainId,
    watch: true,
  })

  return (data || 0) as number
}

export function useShouldNotAllowWithdraw({ lockPeriod, lastDayAction }) {
  const poolLockPeriodUnit = lockPeriod / 3

  const currentDay = useCurrentDay()

  return currentDay - lastDayAction <= poolLockPeriodUnit
}

export function useIfUserLocked() {
  const vaultPoolContract = useVaultPoolContract(VaultKey.CakeVault)
  const { account, chainId } = useActiveWeb3React()

  const { data } = useReadContract({
    chainId,
    abi: vaultPoolContract?.abi,
    address: vaultPoolContract?.address,
    functionName: 'userInfo',
    args: [account!],
    query: {
      enabled: !!account,
    },
  })

  return useMemo(() => {
    if (!Array.isArray(data))
      return {
        locked: false,
        amount: getBalanceAmount(new BigNumber(0)),
      }

    const [userShares, , , , , lockEndTime, , locked, lockedAmount] = data

    const vaultPosition = getVaultPosition({
      userShares: new BigNumber(userShares as unknown as BigNumber.Value),
      locked,
      lockEndTime: lockEndTime.toString(),
    })

    return {
      locked: VaultPosition.Locked === vaultPosition,
      amount: getBalanceAmount(new BigNumber(lockedAmount as unknown as BigNumber.Value)),
    }
  }, [data])
}
export function useStakedPositionsByUser(poolIndexes: number[]): StakedPosition[] {
  const fixedStakingContract = useFixedStakingContract()
  const { address: account } = useAccount()
  const tokens = useOfficialsAndUserAddedTokens()

  const results = useSingleContractMultipleData({
    contract: useMemo(
      () => ({
        abi: fixedStakingContract.abi,
        address: fixedStakingContract.address,
      }),
      [fixedStakingContract],
    ),
    functionName: 'getUserInfo',
    args: useMemo(() => (account ? poolIndexes.map((index) => [index, account]) : []), [account, poolIndexes]),
  })

  const currentDay = useCurrentDay()

  return useMemo(() => {
    if (!Array.isArray(results)) return []
    return results
      .map(({ result }, index) => {
        if (!Array.isArray(result)) return undefined

        const userInfoUserDeposit = new BigNumber(result[0].userInfo.userDeposit)

        if (userInfoUserDeposit.eq(0)) {
          return undefined
        }

        const position = result[0]
        const endPoolTime = position.pool.endDay * 86400 + 43200
        const endLockTime = position.endLockTime > endPoolTime ? endPoolTime : position.endLockTime

        const poolLockPeriodUnit = position.pool.lockPeriod / 3
        const { lastDayAction } = position.userInfo
        const { withdrawalCut1, withdrawalCut2 } = position.pool

        let withdrawalFee: BigNumber | null = null

        const days = currentDay - lastDayAction

        // logic copied from Smart Contract
        if (days <= poolLockPeriodUnit * 2) {
          withdrawalFee = withdrawalCut1
        } else if (days <= poolLockPeriodUnit * 3) {
          withdrawalFee = withdrawalCut2
        }

        const positionPoolTokenAddress = safeGetAddress(position.pool.token)
        const positionPoolToken = positionPoolTokenAddress && tokens[positionPoolTokenAddress]

        if (!positionPoolToken) {
          return undefined
        }

        return {
          ...position,
          pool: {
            ...position.pool,
            withdrawalFee,
            poolIndex: poolIndexes[index],
            token: positionPoolToken,
          },
          endLockTime,
        }
      })
      .filter(Boolean)
  }, [currentDay, poolIndexes, results, tokens])
}

export function useStakedPools(): FixedStakingPool[] {
  const fixedStakingContract = useFixedStakingContract()
  const tokens = useOfficialsAndUserAddedTokens()
  const { chainId } = useActiveChainId()

  const { data: poolLength } = useReadContract({
    abi: fixedStakingContract.abi,
    address: fixedStakingContract.address as `0x${string}`,
    functionName: 'poolLength',
    chainId,
    args: [],
  })

  const numberOfPools = poolLength ? toNumber(poolLength.toString()) : 0

  const fixedStakePools = useSingleContractMultipleData({
    contract: useMemo(
      () => ({
        abi: fixedStakingContract.abi,
        address: fixedStakingContract.address,
      }),
      [fixedStakingContract],
    ),
    functionName: 'pools',
    args: useMemo(
      () => Array.from(Array(numberOfPools).keys()).map((index) => [BigInt(index)] as const),
      [numberOfPools],
    ),
  })

  return useMemo(() => {
    if (!fixedStakePools?.length) return []

    return fixedStakePools
      .map(({ result: fixedStakePool }, index) => {
        if (!fixedStakePool || !chainId) return null

        const token = tokens[getAddress(fixedStakePool[0])]

        const disabled = DISABLED_POOLS[chainId]?.includes(token.address)

        if (disabled) {
          return null
        }

        const lockPeriod = fixedStakePool[5]

        if (lockPeriod < 30) return null

        /*
          struct Pool {
            IERC20Upgradeable token;
            uint32 endDay;
            uint32 lockDayPercent;
            uint32 boostDayPercent;
            uint32 unlockDayPercent;
            uint32 lockPeriod; // Multiples of 3
            uint32 withdrawalCut1;
            uint32 withdrawalCut2;
            bool depositEnabled;
            uint128 maxDeposit;
            uint128 minDeposit;
            uint128 totalDeposited;
            uint128 maxPoolAmount;
            uint128 minBoostAmount;
          }
        */

        return {
          poolIndex: index,
          token,
          endDay: fixedStakePool[1],
          lockDayPercent: fixedStakePool[2],
          boostDayPercent: fixedStakePool[3],
          unlockDayPercent: fixedStakePool[4],
          lockPeriod,
          withdrawalCut1: fixedStakePool[6],
          withdrawalCut2: fixedStakePool[7],
          // set widthdrawalFee as withdrawalCut2 to display pools' fee with unconnected account
          withdrawalFee: fixedStakePool[7],
          depositEnabled: fixedStakePool[8],
          maxDeposit: fixedStakePool[9],
          minDeposit: fixedStakePool[10],
          totalDeposited: new BigNumber(fixedStakePool[11]),
          maxPoolAmount: fixedStakePool[12],
          minBoostAmount: fixedStakePool[13],
        }
      })
      .filter(Boolean) as FixedStakingPool[]
  }, [chainId, fixedStakePools, tokens])
}
