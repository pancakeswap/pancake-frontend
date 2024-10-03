import { ChainId } from '@pancakeswap/sdk'
import { IconButton } from '@pancakeswap/uikit'

import RefreshIcon from 'components/Svg/RefreshIcon'
import { CHAIN_REFRESH_TIME } from 'config/constants/exchange'

export const RefreshButton: React.FC<{ refreshDisabled: boolean; onRefresh: () => void; chainId?: ChainId }> = ({
  refreshDisabled,
  onRefresh,
  chainId,
}) => {
  return (
    <IconButton variant="text" scale="sm" onClick={onRefresh} data-dd-action-name="Swap refresh button">
      <RefreshIcon
        disabled={refreshDisabled}
        color="textSubtle"
        width="20px"
        duration={chainId && CHAIN_REFRESH_TIME[chainId] ? CHAIN_REFRESH_TIME[chainId] / 1000 : undefined}
      />
    </IconButton>
  )
}
