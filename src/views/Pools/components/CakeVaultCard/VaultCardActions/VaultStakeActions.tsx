import { Flex, Skeleton } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'

import { DeserializedPool } from 'state/types'
import HasSharesActions from './HasSharesActions'

interface VaultStakeActionsProps {
  pool: DeserializedPool
  stakingTokenBalance: BigNumber
  accountHasSharesStaked: boolean
  performanceFee: number
  isLoading?: boolean
}

const VaultStakeActions: React.FC<VaultStakeActionsProps> = ({
  pool,
  stakingTokenBalance,
  accountHasSharesStaked,
  performanceFee,
  isLoading = false,
}) => {
  const renderStakeAction = () => {
    return accountHasSharesStaked ? (
      <HasSharesActions pool={pool} stakingTokenBalance={stakingTokenBalance} performanceFee={performanceFee} />
    ) : null
  }

  return <Flex flexDirection="column">{isLoading ? <Skeleton width="100%" height="52px" /> : renderStakeAction()}</Flex>
}

export default VaultStakeActions
