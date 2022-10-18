import { TxnBuilderTypes, TypeTagParser, AptosClient } from 'aptos'
import { PoolResource } from './types'
import { POOLS_ADDRESS } from './constants'

export const fetchPoolsResource = async (provider: AptosClient) => {
  const resources = await provider.getAccountResources(POOLS_ADDRESS)
  const poolsResource = resources.filter((resource) => {
    const parsedTypeTag = new TypeTagParser(resource.type).parseTypeTag() as TxnBuilderTypes.TypeTagStruct
    const { name, module_name: moduleName } = parsedTypeTag.value
    return name.value === 'Syrup' && moduleName.value === 'syrup'
  })
  return poolsResource as PoolResource[]
}
