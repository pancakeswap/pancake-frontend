import { ifos } from 'config/constants/ifo'
import { Ifo } from '../config/constants/types'
import { useIfoResources } from '../views/Ifos/hooks/useIfoResources'
import { IFO_RESOURCE_ACCOUNT_TYPE_METADATA, IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE } from '../views/Ifos/constants'

const activeIfo = ifos.find((ifo) => ifo.isActive)

export const useActiveIfoWithBlocks = (): (Ifo & { startTime: number; endTime: number }) | undefined => {
  const resources = useIfoResources(activeIfo)

  if (!activeIfo) return undefined

  if (
    resources?.isLoading ||
    !resources.data ||
    !resources.data[IFO_RESOURCE_ACCOUNT_TYPE_METADATA] ||
    !resources.data[IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE]?.data
  ) {
    return { ...activeIfo, startTime: 0, endTime: 0 }
  }

  // eslint-disable-next-line camelcase
  const { start_time, end_time } = resources.data[IFO_RESOURCE_ACCOUNT_TYPE_METADATA].data
  return { ...activeIfo, startTime: parseInt(start_time), endTime: parseInt(end_time) }
}
