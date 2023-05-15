import BigNumber from 'bignumber.js'
import { ChainId } from '@pancakeswap/sdk'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import nonBscVault from 'config/abi/nonBscVault.json'
import { getMasterChefV2Address, getNonBscVaultAddress } from 'utils/addressHelpers'
import { SerializedFarmConfig } from 'config/constants/types'
import { verifyBscNetwork } from 'utils/verifyBscNetwork'
import { getCrossFarmingReceiverContract } from 'utils/contractHelpers'
import { farmFetcher } from 'state/farms'
import { Address, erc20ABI } from 'wagmi'
import { viemClients } from 'utils/viem'
import { ContractFunctionResult } from 'viem'

export const fetchFarmUserAllowances = async (
  account: Address,
  farmsToFetch: SerializedFarmConfig[],
  chainId: number,
  proxyAddress?: Address,
) => {
  const isBscNetwork = verifyBscNetwork(chainId)
  const masterChefAddress = isBscNetwork ? getMasterChefV2Address(chainId) : getNonBscVaultAddress(chainId)

  const lpAllowances = (await viemClients[chainId as keyof typeof viemClients].multicall({
    contracts: farmsToFetch.map((farm) => {
      const lpContractAddress = farm.lpAddress
      return {
        abi: erc20ABI,
        address: lpContractAddress,
        functionName: 'allowance',
        args: [account, proxyAddress || masterChefAddress],
      }
    }),
    allowFailure: false,
  })) as ContractFunctionResult<typeof erc20ABI, 'allowance'>[]

  const parsedLpAllowances = lpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance.toString()).toJSON()
  })

  return parsedLpAllowances
}

export const fetchFarmUserTokenBalances = async (
  account: string,
  farmsToFetch: SerializedFarmConfig[],
  chainId: number,
) => {
  const rawTokenBalances = (await viemClients[chainId as keyof typeof viemClients].multicall({
    contracts: farmsToFetch.map((farm) => {
      const lpContractAddress = farm.lpAddress
      return {
        abi: erc20ABI,
        address: lpContractAddress,
        functionName: 'balanceOf',
        args: [account],
      }
    }),
    allowFailure: false,
  })) as ContractFunctionResult<typeof erc20ABI, 'balanceOf'>[]

  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance.toString()).toJSON()
  })
  return parsedTokenBalances
}

export const fetchFarmUserStakedBalances = async (
  account: string,
  farmsToFetch: SerializedFarmConfig[],
  chainId: number,
) => {
  const isBscNetwork = verifyBscNetwork(chainId)
  const masterChefAddress = isBscNetwork ? getMasterChefV2Address(chainId) : getNonBscVaultAddress(chainId)

  const rawStakedBalances = (await viemClients[chainId as keyof typeof viemClients].multicall({
    // @ts-ignore
    contracts: farmsToFetch.map((farm) => {
      return {
        abi: isBscNetwork ? masterChefV2ABI : nonBscVault,
        address: masterChefAddress,
        functionName: 'userInfo',
        args: [farm.vaultPid ?? farm.pid, account],
      }
    }),
    allowFailure: false,
  })) as ContractFunctionResult<typeof masterChefV2ABI, 'userInfo'>[]

  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0].toString()).toJSON()
  })
  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (
  account: Address,
  farmsToFetch: SerializedFarmConfig[],
  chainId: number,
) => {
  const isBscNetwork = verifyBscNetwork(chainId)
  const multiCallChainId = farmFetcher.isTestnet(chainId) ? ChainId.BSC_TESTNET : ChainId.BSC
  const userAddress = isBscNetwork ? account : await fetchCProxyAddress(account, multiCallChainId)
  const masterChefAddress = getMasterChefV2Address(multiCallChainId)

  const rawEarnings = (await viemClients[multiCallChainId as keyof typeof viemClients].multicall({
    contracts: farmsToFetch.map((farm) => {
      return {
        abi: masterChefV2ABI,
        address: masterChefAddress,
        functionName: 'pendingCake',
        args: [farm.pid, userAddress],
      }
    }),
    allowFailure: false,
  })) as ContractFunctionResult<typeof masterChefV2ABI, 'pendingCake'>[]

  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings.toString()).toJSON()
  })
  return parsedEarnings
}

export const fetchCProxyAddress = async (address: Address, chainId: number) => {
  try {
    const crossFarmingAddress = getCrossFarmingReceiverContract(null, chainId)
    const cProxyAddress = await crossFarmingAddress.read.cProxy([address])
    return cProxyAddress
  } catch (error) {
    console.error('Failed Fetch CProxy Address', error)
    return address
  }
}
