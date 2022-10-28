import { ADDRESS } from './generated/ifo'

export const IFO_ADDRESS = ADDRESS

export const IFO_MODULE_NAME = 'IFO'

export const IFO_RESOURCE_ACCOUNT_ADDRESS = IFO_ADDRESS
export const IFO_RESOURCE_ACCOUNT_TYPE_METADATA = 'IFOMetadata'
export const IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE = 'IFOPoolStore'
export const IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA = 'VestingMetadata'

export enum IfoPoolKey {
  UNLIMITED = '0',
  BASIC = '1',
}
