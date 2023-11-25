import { Ifo, fetchUserVestingData, UserVestingData, VestingCharacteristics } from '@pancakeswap/ifos'
import { Address } from 'wagmi'

import { getViemClients } from 'utils/viem'

export type { VestingCharacteristics }

export interface VestingData {
  ifo: Ifo
  userVestingData: UserVestingData
}

export const fetchUserWalletIfoData = async (ifo: Ifo, account?: Address): Promise<VestingData> => {
  const { address, chainId } = ifo
  const userVestingData = await fetchUserVestingData({
    ifoAddress: address,
    chainId,
    account,
    provider: getViemClients,
  })

  return {
    ifo,
    userVestingData,
  }
}
