import { AptosClient } from 'aptos'
import { FarmUserInfoResponse } from 'state/farms/types'
import { FARMS_USER_INFO } from 'state/farms/constants'

interface FetchFarmUserInfoProps {
  provider: AptosClient
  address: string
  userInfoAddress: string
}

export const fetchFarmUserInfo = async ({ provider, address, userInfoAddress }: FetchFarmUserInfoProps) => {
  try {
    const response: FarmUserInfoResponse = await provider.getTableItem(userInfoAddress, {
      key_type: 'address',
      value_type: FARMS_USER_INFO,
      key: address,
    })

    return {
      earnings: response.amount,
      stakedBalance: response.reward_debt,
    }
  } catch (error) {
    console.error('Aptos Fetch Farm User Info Error: ', error)
    return {
      earnings: '0',
      stakedBalance: '0',
    }
  }
}
