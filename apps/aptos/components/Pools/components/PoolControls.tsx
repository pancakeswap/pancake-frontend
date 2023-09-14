import { Coin } from '@pancakeswap/aptos-swap-sdk'
import { Pool } from '@pancakeswap/widgets-internal'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { usePoolsStakedOnly, usePoolsViewMode } from 'state/user'

export default function PoolControls(props) {
  const [viewMode, setViewMode] = usePoolsViewMode()
  const [stakedOnly, setStakedOnly] = usePoolsStakedOnly()
  const { account } = useActiveWeb3React()

  const threshHold = 0

  return (
    <Pool.PoolControls<Coin>
      {...props}
      stakedOnly={stakedOnly}
      setStakedOnly={setStakedOnly}
      viewMode={viewMode}
      setViewMode={setViewMode}
      account={account}
      threshHold={threshHold}
    />
  )
}
