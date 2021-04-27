import React from 'react'
import {
  Flex,
  Text,
  Button,
  IconButton,
  AddIcon,
  MinusIcon,
  Heading,
  useModal,
  Skeleton,
} from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'
import { Pool } from 'state/types'
import { VaultUser } from '../../../types'
import NotEnoughTokensModal from '../../PoolCard/Modals/NotEnoughTokensModal'
import VaultStakeModal from '../VaultModals/VaultStakeModal'
import HasStakeAction from './HasStakeAction'

interface VaultStakeActionsProps {
  pool: Pool
  stakingTokenBalance: BigNumber
  stakingTokenPrice: number
  userInfo: VaultUser
  accountHasSharesStaked: boolean
  pricePerFullShare: BigNumber
  isLoading?: boolean
  account: string
}

const VaultStakeActions: React.FC<VaultStakeActionsProps> = ({
  pool,
  stakingTokenBalance,
  stakingTokenPrice,
  userInfo,
  accountHasSharesStaked,
  pricePerFullShare,
  isLoading = false,
  account,
}) => {
  const { stakingToken } = pool
  const TranslateString = useI18n()

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)

  const [onPresentStake] = useModal(
    <VaultStakeModal
      account={account}
      stakingMax={stakingTokenBalance}
      pool={pool}
      stakingTokenPrice={stakingTokenPrice}
    />,
  )

  const renderStakeAction = () => {
    return accountHasSharesStaked ? (
      <HasStakeAction
        pool={pool}
        stakingTokenBalance={stakingTokenBalance}
        stakingTokenPrice={stakingTokenPrice}
        userInfo={userInfo}
        pricePerFullShare={pricePerFullShare}
        account={account}
      />
    ) : (
      <Button onClick={stakingTokenBalance.toNumber() > 0 ? onPresentStake : onPresentTokenRequired}>
        {TranslateString(1070, 'Stake')}
      </Button>
    )
  }

  return <Flex flexDirection="column">{isLoading ? <Skeleton width="100%" height="52px" /> : renderStakeAction()}</Flex>
}

export default VaultStakeActions
