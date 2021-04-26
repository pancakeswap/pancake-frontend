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
import { getBalanceNumber, formatNumber } from 'utils/formatBalance'
import { Pool } from 'state/types'
import NotEnoughTokensModal from '../../PoolCard/Modals/NotEnoughTokensModal'
import VaultStakeModal from '../VaultModals/VaultStakeModal'

interface VaultStakeActionsProps {
  pool: Pool
  stakingTokenBalance: BigNumber
  stakingTokenPrice: number
  userShares: number
  lastDepositedTime: number
  accountHasSharesStaked: boolean
  isLoading?: boolean
  account: string
}

const VaultStakeActions: React.FC<VaultStakeActionsProps> = ({
  pool,
  stakingTokenBalance,
  stakingTokenPrice,
  userShares,
  lastDepositedTime,
  accountHasSharesStaked,
  isLoading = false,
  account,
}) => {
  const { stakingToken, earningToken } = pool
  const TranslateString = useI18n()
  const formattedBalance = formatNumber(getBalanceNumber(stakingTokenBalance, stakingToken.decimals), 3, 3)
  const stakingMaxDollarValue = formatNumber(
    getBalanceNumber(stakingTokenBalance.multipliedBy(stakingTokenPrice), stakingToken.decimals),
  )

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)

  const [onPresentStake] = useModal(
    <VaultStakeModal
      account={account}
      stakingMax={stakingTokenBalance}
      pool={pool}
      stakingTokenPrice={stakingTokenPrice}
    />,
  )

  const [onPresentUnstake] = useModal(
    // This needs to be changed to userShares / staked CAKE
    <VaultStakeModal
      account={account}
      stakingMax={stakingTokenBalance}
      pool={pool}
      stakingTokenPrice={stakingTokenPrice}
      isRemovingStake
    />,
  )

  const renderStakeAction = () => {
    return accountHasSharesStaked ? (
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column">
          <Heading>{formattedBalance}</Heading>
          <Text fontSize="12px" color="textSubtle">{`~${stakingMaxDollarValue || 0} USD`}</Text>
        </Flex>
        <Flex>
          <IconButton variant="secondary" onClick={onPresentUnstake} mr="6px">
            <MinusIcon color="primary" width="24px" />
          </IconButton>
          <IconButton variant="secondary" onClick={onPresentStake}>
            <AddIcon color="primary" width="24px" height="24px" />
          </IconButton>
        </Flex>
      </Flex>
    ) : (
      <Button onClick={stakingTokenBalance.toNumber() > 0 ? onPresentStake : onPresentTokenRequired}>
        {TranslateString(1070, 'Stake')}
      </Button>
    )
  }

  return <Flex flexDirection="column">{isLoading ? <Skeleton width="100%" height="52px" /> : renderStakeAction()}</Flex>
}

export default VaultStakeActions
