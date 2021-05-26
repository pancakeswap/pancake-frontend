import { Farm } from 'state/types'
import fetchPublicFarmData from './fetchPublicFarmData'

const fetchFarm = async (farm: Farm): Promise<Farm> => {
  const { pid, lpAddresses, token, quoteToken } = farm
  const farmPublicData = await fetchPublicFarmData(pid, lpAddresses, token, quoteToken)

  return { ...farm, ...farmPublicData }
}

export default fetchFarm
