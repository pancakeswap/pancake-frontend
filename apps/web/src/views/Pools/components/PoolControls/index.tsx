import { useAccount } from 'wagmi'
import { Pool } from '@pancakeswap/widgets-internal'
import { updateQueryFromRouter } from '@pancakeswap/uikit'
import { useUserPoolStakedOnly, useUserPoolsViewMode } from 'state/user/hooks'
import { useInitialBlockTimestamp } from 'state/block/hooks'
import { Token } from '@pancakeswap/sdk'
import { ViewMode } from 'state/user/actions'
import { useRouter } from 'next/router'

const POOL_START_THRESHOLD = 60 * 4

export default function PoolControlsContainer(props) {
  const router = useRouter()
  const [_stakedOnly, setStakedOnly] = useUserPoolStakedOnly()
  const stakedOnly = typeof router.query?.stakedOnly === 'string' ? !!router.query.stakedOnly : _stakedOnly
  const [_viewMode, setViewMode] = useUserPoolsViewMode()
  const viewMode =
    typeof router.query?.viewMode === 'string' ? ViewMode[router.query.viewMode as keyof typeof ViewMode] : _viewMode
  const { address: account } = useAccount()
  const initialBlockTimestamp = useInitialBlockTimestamp()
  const threshHold = Number(initialBlockTimestamp) > 0 ? Number(initialBlockTimestamp) + POOL_START_THRESHOLD : 0

  return (
    <Pool.PoolControls<Token>
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
