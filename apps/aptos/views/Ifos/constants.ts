import { ADDRESS } from './generated/ifo'

export const IFO_ADDRESS = ADDRESS

export const IFO_MODULE_NAME = 'IFO'

export const IFO_RESOURCE_ACCOUNT_TYPE_METADATA = 'IFOMetadata'
export const IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE = 'IFOPool'
export const IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA = 'VestingMetadata'
export const IFO_TYPE_USER_INFO = 'UserInfo'

// Get it from 0x1::code::PackageRegistry::PancakePhantomTypes in IFO ADDRESS
export const IFO_HANDLER_ADDRESS = '0x9936836587ca33240d3d3f91844651b16cb07802faf5e34514ed6f78580deb0a'

export const USER_IFO_POOL_TAG = `${IFO_ADDRESS}::${IFO_MODULE_NAME}::${IFO_TYPE_USER_INFO}`
export const IFO_POOL_STORE_TAG = `${IFO_ADDRESS}::${IFO_MODULE_NAME}::${IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE}`
export const getIFOUID = (uid) => `${IFO_HANDLER_ADDRESS}::uints::U${uid}`

export enum IfoPoolKey {
  UNLIMITED = '0',
  BASIC = '1',
}
