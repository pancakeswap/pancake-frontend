// import { useCallback } from 'react'
// import useActiveWeb3React from 'hooks/useActiveWeb3React'
// import { useAppDispatch } from 'state'
// import { fetchFarmUserDataAsync } from 'state/farms'
import useStakeFarms from '../../../hooks/useStakeFarms'
import useUnstakeFarms from '../../../hooks/useUnstakeFarms'

export function useStakedActions(pid) {
  // const { account, chainId } = useActiveWeb3React()
  const { onStake } = useStakeFarms(pid)
  const { onUnstake } = useUnstakeFarms(pid)
  // const dispatch = useAppDispatch()

  const onDone = () => console.info('onDone')
  // const onDone = useCallback(
  //   () => dispatch(fetchFarmUserDataAsync({ account, pids: [pid], chainId })),
  //   [account, pid, chainId, dispatch],
  // )

  return {
    onStake,
    onUnstake,
    onDone,
  }
}

export const StakedContainer = ({ children, ...props }) => {
  const { onStake, onUnstake, onDone } = useStakedActions(props.pid)

  return children({
    ...props,
    onStake,
    onDone,
    onUnstake,
  })
}
