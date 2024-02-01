import { ChainId } from '@pancakeswap/chains'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { Address } from 'viem'
import { OnChainProvider } from '../types'
import { getIfoCreditAddressContract } from './fetchUserIfo'

interface Params {
  account?: Address
  chainId?: ChainId
  endTime: number
  provider: OnChainProvider
}

export const getUserCreditWithTime = async ({ account, chainId, endTime, provider }: Params) => {
  try {
    if (!account || !chainId || !endTime || !provider) {
      return BIG_ZERO.toJSON()
    }

    const ifoCreditContract = getIfoCreditAddressContract(chainId, provider)
    const credit = await ifoCreditContract.read.getUserCreditWithTime([account, BigInt(endTime)])
    return new BigNumber(credit.toString()).toJSON()
  } catch (error) {
    console.error(error)
    return BIG_ZERO.toJSON()
  }
}
