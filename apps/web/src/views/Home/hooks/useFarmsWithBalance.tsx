import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { multicallv3 } from 'utils/multicall'
import masterChefABI from 'config/abi/masterchef.json'
import cakeAbi from 'config/abi/cake.json'
import { FAST_INTERVAL } from 'config/constants'
import { SerializedFarmConfig } from 'config/constants/types'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import useSWR from 'swr'
import { useFarmsLength } from 'state/farms/hooks'
import { getFarmConfig } from '@pancakeswap/farms/constants'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useBCakeProxyContract, useMasterchef, useMasterchefV3 } from 'hooks/useContract'
import { CAKE } from '@pancakeswap/tokens'
import { useMemo } from 'react'
import { useStakedPositionsByUser } from 'state/farmsV3/hooks'
import { useV3TokenIdsByAccount } from 'hooks/v3/useV3Positions'
import { Masterchef, BCakeProxy } from 'config/abi/types'
import { verifyBscNetwork } from 'utils/verifyBscNetwork'
import { useBCakeProxyContractAddress } from '../../Farms/hooks/useBCakeProxyContractAddress'
import splitProxyFarms from '../../Farms/components/YieldBooster/helpers/splitProxyFarms'

export type FarmWithBalance = {
  balance: BigNumber
  contract: Masterchef | BCakeProxy
} & SerializedFarmConfig

const useFarmsWithBalance = () => {
  const { account, chainId } = useActiveWeb3React()
  const { data: poolLength } = useFarmsLength()
  const { proxyAddress, isLoading: isProxyContractAddressLoading } = useBCakeProxyContractAddress(account, chainId)
  const bCakeProxy = useBCakeProxyContract(proxyAddress)
  const masterChefContract = useMasterchef()

  const masterchefV3 = useMasterchefV3()
  const { tokenIds: stakedTokenIds } = useV3TokenIdsByAccount(masterchefV3, account)

  const { tokenIdResults: v3PendingCakes } = useStakedPositionsByUser(stakedTokenIds)

  const getFarmsWithBalances = async (
    farms: SerializedFarmConfig[],
    accountToCheck: string,
    contract: Masterchef | BCakeProxy,
  ) => {
    const masterChefCalls = farms.map((farm) => ({
      abi: masterChefABI,
      address: masterChefContract.address,
      name: 'pendingCake',
      params: [farm.pid, accountToCheck],
    }))

    const proxyCall =
      contract.address !== masterChefContract.address && bCakeProxy
        ? {
            abi: cakeAbi,
            address: CAKE[chainId].address,
            name: 'balanceOf',
            params: [bCakeProxy.address],
          }
        : null

    const calls = [...masterChefCalls, proxyCall].filter(Boolean)

    const rawResults = await multicallv3({ calls })
    const proxyCakeBalance = rawResults?.length > 0 && proxyCall ? rawResults.pop() : null
    const proxyCakeBalanceNumber = proxyCakeBalance ? getBalanceNumber(new BigNumber(proxyCakeBalance.toString())) : 0
    const results = farms.map((farm, index) => ({ ...farm, balance: new BigNumber(rawResults[index]) }))
    const farmsWithBalances: FarmWithBalance[] = results
      .filter((balanceType) => balanceType.balance.gt(0))
      .map((farm) => ({
        ...farm,
        contract,
      }))
    const totalEarned = farmsWithBalances.reduce((accum, earning) => {
      const earningNumber = new BigNumber(earning.balance)
      if (earningNumber.eq(0)) {
        return accum
      }
      return accum + earningNumber.div(DEFAULT_TOKEN_DECIMAL).toNumber()
    }, 0)
    return { farmsWithBalances, totalEarned: totalEarned + proxyCakeBalanceNumber }
  }

  const {
    data: { farmsWithStakedBalance, earningsSum } = {
      farmsWithStakedBalance: [] as FarmWithBalance[],
      earningsSum: null,
    },
  } = useSWR(
    account && poolLength && chainId && !isProxyContractAddressLoading
      ? [account, 'farmsWithBalance', chainId, poolLength]
      : null,
    async () => {
      const farmsConfig = await getFarmConfig(chainId)
      const farmsCanFetch = farmsConfig.filter((f) => poolLength > f.pid)
      const normalBalances = await getFarmsWithBalances(farmsCanFetch, account, masterChefContract)
      if (proxyAddress && farmsCanFetch?.length && verifyBscNetwork(chainId)) {
        const { farmsWithProxy } = splitProxyFarms(farmsCanFetch)

        const proxyBalances = await getFarmsWithBalances(farmsWithProxy, proxyAddress, bCakeProxy)
        return {
          farmsWithStakedBalance: [...normalBalances.farmsWithBalances, ...proxyBalances.farmsWithBalances],
          earningsSum: normalBalances.totalEarned + proxyBalances.totalEarned,
        }
      }
      return {
        farmsWithStakedBalance: normalBalances.farmsWithBalances,
        earningsSum: normalBalances.totalEarned,
      }
    },
    { refreshInterval: FAST_INTERVAL },
  )

  const v3FarmsWithBalance = stakedTokenIds
    .map((tokenId, i) => {
      if (v3PendingCakes?.[i]?.gt(0)) {
        return {
          sendTx: {
            tokenId: tokenId.toString(),
            to: account,
          },
        }
      }
      return null
    })
    .filter(Boolean)

  return useMemo(() => {
    return {
      farmsWithStakedBalance: [...farmsWithStakedBalance, ...v3FarmsWithBalance],
      earningsSum:
        earningsSum +
          v3PendingCakes?.reduce((accum, earning) => {
            const earningNumber = new BigNumber(earning.toString())
            if (earningNumber.eq(0)) {
              return accum
            }
            return accum + earningNumber.div(DEFAULT_TOKEN_DECIMAL).toNumber()
          }, 0) ?? 0,
    }
  }, [earningsSum, farmsWithStakedBalance, v3FarmsWithBalance, v3PendingCakes])
}

export default useFarmsWithBalance
