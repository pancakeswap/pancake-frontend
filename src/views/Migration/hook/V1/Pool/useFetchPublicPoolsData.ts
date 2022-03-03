import { useAppDispatch } from 'state'
import { useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { fetchFarmsPublicDataAsync, nonArchivedFarms } from 'state/farmsV1/index'

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()

  useSlowRefreshEffect((currentBlock) => {
    const fetchPoolsDataWithFarms = async () => {
      const activeFarms = nonArchivedFarms.filter((farm) => farm.v1pid !== 0)
      await dispatch(fetchFarmsPublicDataAsync(activeFarms.map((farm) => farm.v1pid)))
      // batch(() => {
      //   dispatch(fetchPoolsPublicDataAsync(currentBlock))
      //   dispatch(fetchPoolsStakingLimitsAsync())
      // })
    }

    fetchPoolsDataWithFarms()
  }, [])
}
