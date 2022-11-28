import { ADDRESS } from './generated/ifo'

export const IFO_ADDRESS = ADDRESS

export const IFO_MODULE_NAME = 'IFO'

export const IFO_RESOURCE_ACCOUNT_TYPE_METADATA = 'IFOMetadata'
export const IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE = 'IFOPool'
export const IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA = 'VestingMetadata'
export const IFO_TYPE_USER_INFO = 'UserInfo'

export const USER_IFO_POOL_TAG = `${IFO_ADDRESS}::${IFO_MODULE_NAME}::${IFO_TYPE_USER_INFO}`

export enum IfoPoolKey {
  UNLIMITED = '0',
  BASIC = '1',
}
