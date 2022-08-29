import { ChainId } from '@pancakeswap/sdk'
import { useAppDispatch } from 'state'
import { getFarmConfig } from '@pancakeswap/farm-constants'
import { useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { fetchFarmsPublicDataAsync } from 'state/farmsV1/index'

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()

  useSlowRefreshEffect(() => {
    const fetchPoolsDataWithFarms = async () => {
      const farmsConfig = await getFarmConfig(ChainId.BSC)
      const activeFarms = farmsConfig.filter((farm) => farm.v1pid !== 0)
      await dispatch(fetchFarmsPublicDataAsync(activeFarms.map((farm) => farm.v1pid)))
    }

    fetchPoolsDataWithFarms()
  })
}
