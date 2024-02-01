import { Ifo, UserVestingData, VestingCharacteristics, fetchUserVestingData } from '@pancakeswap/ifos'
import { Address } from 'viem'

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
