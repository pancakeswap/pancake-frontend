import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { ChainId } from '@pancakeswap/chains'
import { CAKE } from '@pancakeswap/tokens'
import { Address } from 'viem'

import { cakeVaultV2ABI } from '../abis/ICakeVaultV2'
import { OnChainProvider } from '../types'
import { getCakeFlexibleSideVaultAddress, getCakeVaultAddress } from './getAddresses'

interface Params {
  cakeVaultAddress?: Address
  chainId: ChainId
  provider: OnChainProvider
}

const balanceOfAbi = [
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const fetchPublicVaultData = async ({
  chainId,
  cakeVaultAddress = getCakeVaultAddress(chainId),
  provider,
}: Params) => {
  try {
    const client = provider({ chainId })

    const [sharePrice, shares, totalLockedAmount, totalCakeInVault] = await client.multicall({
      contracts: [
        {
          abi: cakeVaultV2ABI,
          address: cakeVaultAddress,
          functionName: 'getPricePerFullShare',
        },
        {
          abi: cakeVaultV2ABI,
          address: cakeVaultAddress,
          functionName: 'totalShares',
        },
        {
          abi: cakeVaultV2ABI,
          address: cakeVaultAddress,
          functionName: 'totalLockedAmount',
        },
        {
          abi: balanceOfAbi,
          address: CAKE[ChainId.BSC].address,
          functionName: 'balanceOf',
          args: [cakeVaultAddress],
        },
      ],
      allowFailure: true,
    })

    const totalSharesAsBigNumber =
      shares.status === 'success' && shares.result ? new BigNumber(shares.result.toString()) : BIG_ZERO
    const totalLockedAmountAsBigNumber =
      totalLockedAmount.status === 'success' && totalLockedAmount.result
        ? new BigNumber(totalLockedAmount.result.toString())
        : BIG_ZERO
    const sharePriceAsBigNumber =
      sharePrice.status === 'success' && sharePrice.result ? new BigNumber(sharePrice.result.toString()) : BIG_ZERO

    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      totalLockedAmount: totalLockedAmountAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalCakeInVault: totalCakeInVault.result ? new BigNumber(totalCakeInVault.result.toString()).toJSON() : '0',
    }
  } catch (error) {
    return {
      totalShares: null,
      totalLockedAmount: null,
      pricePerFullShare: null,
      totalCakeInVault: null,
    }
  }
}

export const fetchPublicFlexibleSideVaultData = async ({
  chainId,
  cakeVaultAddress = getCakeFlexibleSideVaultAddress(chainId),
  provider,
}: Params) => {
  try {
    const client = provider({ chainId })

    const [sharePrice, shares, totalCakeInVault] = await client.multicall({
      contracts: [
        {
          abi: cakeVaultV2ABI,
          address: cakeVaultAddress,
          functionName: 'getPricePerFullShare',
        },
        {
          abi: cakeVaultV2ABI,
          address: cakeVaultAddress,
          functionName: 'totalShares',
        },
        {
          abi: balanceOfAbi,
          address: CAKE[ChainId.BSC].address,
          functionName: 'balanceOf',
          args: [cakeVaultAddress],
        },
      ],
      allowFailure: true,
    })

    const totalSharesAsBigNumber = shares.status === 'success' ? new BigNumber(shares.result.toString()) : BIG_ZERO
    const sharePriceAsBigNumber =
      sharePrice.status === 'success' ? new BigNumber(sharePrice.result.toString()) : BIG_ZERO
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalCakeInVault: new BigNumber((totalCakeInVault.result || '0').toString()).toJSON(),
    }
  } catch (error) {
    return {
      totalShares: null,
      pricePerFullShare: null,
      totalCakeInVault: null,
    }
  }
}

export const fetchVaultFees = async ({
  chainId,
  cakeVaultAddress = getCakeVaultAddress(chainId),
  provider,
}: Params) => {
  try {
    const client = provider({ chainId })

    const [performanceFee, withdrawalFee, withdrawalFeePeriod] = await client.multicall({
      contracts: [
        {
          abi: cakeVaultV2ABI,
          address: cakeVaultAddress,
          functionName: 'performanceFee',
        },
        {
          abi: cakeVaultV2ABI,
          address: cakeVaultAddress,
          functionName: 'withdrawFee',
        },
        {
          abi: cakeVaultV2ABI,
          address: cakeVaultAddress,
          functionName: 'withdrawFeePeriod',
        },
      ],
      allowFailure: false,
    })

    return {
      performanceFee: Number(performanceFee),
      withdrawalFee: Number(withdrawalFee),
      withdrawalFeePeriod: Number(withdrawalFeePeriod),
    }
  } catch (error) {
    return {
      performanceFee: null,
      withdrawalFee: null,
      withdrawalFeePeriod: null,
    }
  }
}
