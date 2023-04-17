import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { Contract } from '@ethersproject/contracts'
import { ChainId } from '@pancakeswap/sdk'

import cakeAbi from '../abis/ICake.json'
import { ICAKE } from '../constants/contracts'
import { OnChainProvider } from '../types'
import { getContractAddress } from '../utils'

const getIfoCreditAddressContract = (chainId: ChainId, provider: OnChainProvider) => {
  const address = getContractAddress(ICAKE, chainId)
  if (!address) {
    throw new Error(`ICAKE not supported on chain ${chainId}`)
  }
  return new Contract(getContractAddress(ICAKE, chainId), cakeAbi, provider({ chainId }))
}

export const fetchPublicIfoData = async (chainId: ChainId, provider: OnChainProvider) => {
  try {
    const ifoCreditAddressContract = getIfoCreditAddressContract(chainId, provider)
    const ceiling = await ifoCreditAddressContract.ceiling()
    return {
      ceiling: new BigNumber(ceiling.toString()).toJSON(),
    }
  } catch (error) {
    return {
      ceiling: BIG_ZERO.toJSON(),
    }
  }
}

interface Params {
  account: string
  chainId: ChainId
  provider: OnChainProvider
}

export const fetchUserIfoCredit = async ({ account, chainId, provider }: Params) => {
  try {
    const ifoCreditAddressContract = getIfoCreditAddressContract(chainId, provider)
    const credit = await ifoCreditAddressContract.getUserCredit(account)
    return new BigNumber(credit.toString()).toJSON()
  } catch (error) {
    console.error(error)
    return BIG_ZERO.toJSON()
  }
}
