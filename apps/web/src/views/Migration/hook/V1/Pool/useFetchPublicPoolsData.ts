import { ChainId } from '@pancakeswap/sdk'
import { useAppDispatch } from 'state'
import { getFarmConfig } from '@pancakeswap/farms/constants'
import { useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { fetchFarmsPublicDataAsync } from 'state/farmsV1/index'
import {useActiveChainId} from "../../../../../hooks/useActiveChainId";

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()

  useSlowRefreshEffect(() => {
    const fetchPoolsDataWithFarms = async () => {
      const farmsConfig = await getFarmConfig(chainId)
      const activeFarms = farmsConfig.filter((farm) => farm.v1pid !== 0)
      await dispatch(fetchFarmsPublicDataAsync({pids: activeFarms.map((farm) => farm.v1pid), chainId}))
    }

    fetchPoolsDataWithFarms()
  })
}
