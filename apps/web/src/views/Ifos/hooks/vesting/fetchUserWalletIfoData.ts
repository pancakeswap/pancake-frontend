import {
  Ifo,
  UserVestingData,
  VestingCharacteristics,
  fetchUserVestingData,
  fetchUserVestingDataV8,
} from '@pancakeswap/ifos'
import { Address } from 'viem'

import { getViemClients } from 'utils/viem'

export type { VestingCharacteristics }

export interface VestingData {
  ifo: Ifo
  userVestingData: UserVestingData
}

export const fetchUserWalletIfoData = async (ifo: Ifo, account?: Address): Promise<VestingData> => {
  const { address, chainId, version } = ifo
  const fetchUserData = version >= 8 ? fetchUserVestingDataV8 : fetchUserVestingData
  const userVestingData = await fetchUserData({
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
