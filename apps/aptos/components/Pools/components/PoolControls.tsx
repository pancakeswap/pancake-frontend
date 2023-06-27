import { Coin } from '@pancakeswap/aptos-swap-sdk'
import { Pool } from '@pancakeswap/widgets-internal'
import { ViewMode } from '@pancakeswap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { usePoolsStakedOnly, usePoolsViewMode } from 'state/user'
import { useRouter } from 'next/router'
import updateQueryFromRouter from '@pancakeswap/utils/updateQueryFromRouter'

export default function PoolControls(props) {
  const router = useRouter()
  const [_viewMode, setViewMode] = usePoolsViewMode()
  const viewMode =
    typeof router.query?.viewMode === 'string' ? ViewMode[router.query.viewMode as keyof typeof ViewMode] : _viewMode
  const [_stakedOnly, setStakedOnly] = usePoolsStakedOnly()
  const stakedOnly = typeof router.query?.stakedOnly === 'string' ? !!router.query.stakedOnly : _stakedOnly
  const { account } = useActiveWeb3React()

  const threshHold = 0

  return (
    <Pool.PoolControls<Coin>
      {...props}
      stakedOnly={stakedOnly}
      setStakedOnly={() => {
        updateQueryFromRouter(router, 'stakedOnly', !stakedOnly)
        setStakedOnly(!stakedOnly)
      }}
      viewMode={viewMode}
      setViewMode={(newViewMode) => {
        updateQueryFromRouter(router, 'viewMode', newViewMode)
        setViewMode(newViewMode)
      }}
      account={account}
      threshHold={threshHold}
    />
  )
}
