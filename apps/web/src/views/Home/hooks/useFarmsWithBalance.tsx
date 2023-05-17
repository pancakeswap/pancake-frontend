import BigNumber from 'bignumber.js'
import { FAST_INTERVAL } from 'config/constants'
import { SerializedFarmConfig } from 'config/constants/types'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import useSWR from 'swr'
import { useFarmsLength } from 'state/farms/hooks'
import { getFarmConfig } from '@pancakeswap/farms/constants'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useBCakeProxyContract, useCake, useMasterchef, useMasterchefV3 } from 'hooks/useContract'
import { useMemo } from 'react'
import { useStakedPositionsByUser } from 'state/farmsV3/hooks'
import { useV3TokenIdsByAccount } from 'hooks/v3/useV3Positions'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { verifyBscNetwork } from 'utils/verifyBscNetwork'
import { publicClient } from 'utils/wagmi'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import { useBCakeProxyContractAddress } from '../../Farms/hooks/useBCakeProxyContractAddress'
import splitProxyFarms from '../../Farms/components/YieldBooster/helpers/splitProxyFarms'

export type FarmWithBalance = {
  balance: BigNumber
  contract: any
} & SerializedFarmConfig

const useFarmsWithBalance = () => {
  const { account, chainId } = useAccountActiveChain()
  const { data: poolLength } = useFarmsLength()
  const { proxyAddress, isLoading: isProxyContractAddressLoading } = useBCakeProxyContractAddress(account, chainId)
  const bCakeProxy = useBCakeProxyContract(proxyAddress)
  const masterChefContract = useMasterchef()
  const cake = useCake()

  const masterchefV3 = useMasterchefV3()
  const { tokenIds: stakedTokenIds } = useV3TokenIdsByAccount(masterchefV3?.address, account)

  const { tokenIdResults: v3PendingCakes } = useStakedPositionsByUser(stakedTokenIds)

  const getFarmsWithBalances = async (farms: SerializedFarmConfig[], accountToCheck: string, contract) => {
    const result = await publicClient({ chainId }).multicall({
      contracts: farms.map((farm) => ({
        abi: masterChefV2ABI,
        address: masterChefContract.address,
        functionName: 'pendingCake',
        args: [farm.pid, accountToCheck],
      })),
    })

    const proxyCakeBalance =
      contract.address !== masterChefContract.address && bCakeProxy
        ? await cake.read.balanceOf([bCakeProxy.address])
        : null

    const proxyCakeBalanceNumber = proxyCakeBalance ? getBalanceNumber(new BigNumber(proxyCakeBalance.toString())) : 0
    const results = farms.map((farm, index) => ({
      ...farm,
      balance: new BigNumber((result[index].result as bigint).toString()),
    }))
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
      const farmsCanFetch = farmsConfig?.filter((f) => poolLength > f.pid)
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
      if (v3PendingCakes?.[i] > 0n) {
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
