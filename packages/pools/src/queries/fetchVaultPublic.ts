import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { ChainId } from '@pancakeswap/sdk'
import { CAKE } from '@pancakeswap/tokens'
import { createMulticall } from '@pancakeswap/multicall'

import cakeAbi from '../abis/Cake.json'
import cakeVaultAbi from '../abis/ICakeVaultV2.json'
import { OnChainProvider } from '../types'
import { getCakeFlexibleSideVaultAddress, getCakeVaultAddress } from './getAddresses'

interface Params {
  cakeVaultAddress?: string
  chainId: ChainId
  provider: OnChainProvider
}

export const fetchPublicVaultData = async ({
  chainId,
  cakeVaultAddress = getCakeVaultAddress(chainId),
  provider,
}: Params) => {
  try {
    const calls = ['getPricePerFullShare', 'totalShares', 'totalLockedAmount'].map((method) => ({
      abi: cakeVaultAbi,
      address: cakeVaultAddress,
      name: method,
    }))

    const cakeBalanceOfCall = {
      abi: cakeAbi,
      address: CAKE[ChainId.BSC].address,
      name: 'balanceOf',
      params: [cakeVaultAddress],
    }

    const { multicallv3 } = createMulticall(provider)
    const [[sharePrice], [shares], totalLockedAmount, [totalCakeInVault]] = await multicallv3({
      calls: [...calls, cakeBalanceOfCall],
      allowFailure: true,
      chainId,
    })

    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
    const totalLockedAmountAsBigNumber = totalLockedAmount ? new BigNumber(totalLockedAmount[0].toString()) : BIG_ZERO
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      totalLockedAmount: totalLockedAmountAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalCakeInVault: new BigNumber(totalCakeInVault.toString()).toJSON(),
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
    const calls = ['getPricePerFullShare', 'totalShares'].map((method) => ({
      abi: cakeVaultAbi,
      address: cakeVaultAddress,
      name: method,
    }))

    const cakeBalanceOfCall = {
      abi: cakeAbi,
      address: CAKE[ChainId.BSC].address,
      name: 'balanceOf',
      params: [cakeVaultAddress],
    }

    const { multicallv3 } = createMulticall(provider)
    const [[sharePrice], [shares], [totalCakeInVault]] = await multicallv3({
      calls: [...calls, cakeBalanceOfCall],
      allowFailure: true,
      chainId,
    })

    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalCakeInVault: new BigNumber(totalCakeInVault.toString()).toJSON(),
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
    const calls = ['performanceFee', 'withdrawFee', 'withdrawFeePeriod'].map((method) => ({
      address: cakeVaultAddress,
      name: method,
    }))

    const { multicallv2 } = createMulticall(provider)
    const [[performanceFee], [withdrawalFee], [withdrawalFeePeriod]] = await multicallv2({
      abi: cakeVaultAbi,
      calls,
      chainId,
    })

    return {
      performanceFee: performanceFee.toNumber(),
      withdrawalFee: withdrawalFee.toNumber(),
      withdrawalFeePeriod: withdrawalFeePeriod.toNumber(),
    }
  } catch (error) {
    return {
      performanceFee: null,
      withdrawalFee: null,
      withdrawalFeePeriod: null,
    }
  }
}
