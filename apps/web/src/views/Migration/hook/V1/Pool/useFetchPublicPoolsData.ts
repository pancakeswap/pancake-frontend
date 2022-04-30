import { useAppDispatch } from 'state'
import farmsConfig from 'config/constants/farms'
import { useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { fetchFarmsPublicDataAsync } from 'state/farmsV1/index'

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()

  useSlowRefreshEffect(() => {
    const fetchPoolsDataWithFarms = async () => {
      const activeFarms = farmsConfig.filter((farm) => farm.v1pid !== 0)
      await dispatch(fetchFarmsPublicDataAsync(activeFarms.map((farm) => farm.v1pid)))
    }

    fetchPoolsDataWithFarms()
  })
}
