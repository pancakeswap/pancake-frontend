import { ADDRESS } from './generated/ifo'

export const IFO_ADDRESS = ADDRESS

export const IFO_MODULE_NAME = 'IFO'

export const IFO_RESOURCE_ACCOUNT_TYPE_METADATA = 'IFOMetadata'
export const IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE = 'IFOPool'
export const IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA = 'VestingMetadata'
export const IFO_TYPE_USER_INFO = 'UserInfo'

// Get it from 0x1::code::PackageRegistry::PancakePhantomTypes in IFO ADDRESS
export const IFO_HANDLER_ADDRESS = '0xb664f557c71de85be5cf91563961c5bb05345ba2b33f361533d2c184577185b7'

export const USER_IFO_POOL_TAG = `${IFO_ADDRESS}::${IFO_MODULE_NAME}::${IFO_TYPE_USER_INFO}`
export const IFO_POOL_STORE_TAG = `${IFO_ADDRESS}::${IFO_MODULE_NAME}::${IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE}`
export const getIFOUID = (uid) => `${IFO_HANDLER_ADDRESS}::uints::U${uid}`

export enum IfoPoolKey {
  UNLIMITED = '0',
  BASIC = '1',
}
