import { Ifo } from 'config/constants/types'
import { IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE } from 'views/Ifos/constants'
import { useIfoResources } from './useIfoResources'

export const useIfoPool = (ifo: Ifo) => {
  const resources = useIfoResources(ifo)

  return resources?.data?.[IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE]
}
