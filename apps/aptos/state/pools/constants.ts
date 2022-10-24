import { ADDRESS } from './syrup'

export const POOLS_ADDRESS = ADDRESS
export const POOLS_MODULE_NAME = 'syrup' as const
export const POOLS_NAME = 'Syrup' as const

export const POOLS_ADDRESS_MODULE = `${POOLS_ADDRESS}::${POOLS_MODULE_NAME}` as const

export const POOLS_ADDRESS_SYRUP_USER = `${POOLS_ADDRESS}::${POOLS_MODULE_NAME}::SyrupUser` as const
