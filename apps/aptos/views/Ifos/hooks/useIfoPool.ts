import { IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE } from 'views/Ifos/constants'
import { useIfoResources } from './useIfoResources'

export const useIfoPool = () => {
  const resources = useIfoResources()

  return resources?.data?.[IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE]
}
