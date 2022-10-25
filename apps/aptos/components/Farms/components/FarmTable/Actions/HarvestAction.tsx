// import { useCallback } from 'react'
// import { useAppDispatch } from 'state'
// import { fetchFarmUserDataAsync } from 'state/farms'
// import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useHarvestFarm from '../../../hooks/useHarvestFarm'

export const HarvestActionContainer = ({ children, ...props }) => {
  const { onReward } = useHarvestFarm(props.pid)
  // const { account, chainId } = useActiveWeb3React()
  // const dispatch = useAppDispatch()

  const onDone = () => console.info('onDone')
  // const onDone = useCallback(
  //   () => dispatch(fetchFarmUserDataAsync({ account, pids: [props.pid], chainId })),
  //   [account, dispatch, chainId, props.pid],
  // )

  return children({ ...props, onDone, onReward })
}
