import { ChainId } from '@pancakeswap/sdk'
import { IconButton, SwapLoading } from '@pancakeswap/uikit'

import RefreshIcon from 'components/Svg/RefreshIcon'
import { CHAIN_REFRESH_TIME } from 'config/constants/exchange'

export const RefreshButton: React.FC<{
  refreshDisabled: boolean
  onRefresh: () => void
  chainId?: ChainId
  loading?: boolean
}> = ({ refreshDisabled, onRefresh, chainId, loading }) => {
  return (
    <IconButton
      variant="text"
      scale="sm"
      disabled={loading}
      onClick={onRefresh}
      data-dd-action-name="Swap refresh button"
      style={{ backgroundColor: loading ? 'transparent' : undefined, transform: 'rotate(-45deg)' }}
    >
      {loading ? (
        <SwapLoading />
      ) : (
        <RefreshIcon
          disabled={refreshDisabled}
          color="textSubtle"
          innerColor="#02919D"
          width="20px"
          duration={chainId && CHAIN_REFRESH_TIME[chainId] ? CHAIN_REFRESH_TIME[chainId] / 1000 : undefined}
        />
      )}
    </IconButton>
  )
}
