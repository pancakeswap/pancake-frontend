import { createAccountResourceFilter } from '@pancakeswap/awgmi/core'
import { FARMS_ADDRESS, FARMS_MODULE_NAME, FARMS_NAME } from '../constants'
import { FarmResource } from '../types'

export const farmsPublicDataSelector = createAccountResourceFilter<FarmResource>({
  address: FARMS_ADDRESS,
  moduleName: FARMS_MODULE_NAME,
  name: FARMS_NAME,
})
