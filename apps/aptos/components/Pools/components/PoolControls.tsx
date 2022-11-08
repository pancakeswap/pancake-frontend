import { Coin } from '@pancakeswap/aptos-swap-sdk'
import { Pool } from '@pancakeswap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { usePoolsStakedOnly, usePoolsViewMode } from 'state/user'

// const POOL_START_BLOCK_THRESHOLD = (60 / BSC_BLOCK_TIME) * 4

export default function PoolControls(props) {
  const [viewMode, setViewMode] = usePoolsViewMode()
  const [stakedOnly, setStakedOnly] = usePoolsStakedOnly()
  const { account } = useActiveWeb3React()
  // const initialBlock = useInitialBlock()
  // const threshHold = initialBlock > 0 ? initialBlock + POOL_START_BLOCK_THRESHOLD : 0
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
