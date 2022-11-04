import { ADDRESS, MASTERCHEF_MODULE_NAME } from 'config/constants/contracts/masterchef'

export const FARMS_ADDRESS = ADDRESS
export const FARMS_MODULE_NAME = MASTERCHEF_MODULE_NAME
export const FARMS_NAME = 'MasterChef' as const

export const FARMS_NAME_TAG = `${ADDRESS}::${FARMS_MODULE_NAME}::${FARMS_NAME}` as const
export const FARMS_USER_INFO_RESOURCE = `${ADDRESS}::${FARMS_MODULE_NAME}::PoolUserInfo` as const

export const FARMS_USER_INFO = `${ADDRESS}::${FARMS_MODULE_NAME}::UserInfo` as const
