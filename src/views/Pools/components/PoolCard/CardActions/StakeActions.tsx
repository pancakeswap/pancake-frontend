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
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber, formatNumber, getDecimalAmount } from 'utils/formatBalance'
import { Pool } from 'state/types'
import NotEnoughTokensModal from '../Modals/NotEnoughTokensModal'
import StakeModal from '../Modals/StakeModal'

interface StakeActionsProps {
  pool: Pool
  stakingTokenBalance: BigNumber
  stakingTokenPrice: number
  stakedBalance: BigNumber
  isBnbPool: boolean
  isStaked: ConstrainBoolean
  isLoading?: boolean
}

const StakeAction: React.FC<StakeActionsProps> = ({
  pool,
  stakingTokenBalance,
  stakingTokenPrice,
  stakedBalance,
  isBnbPool,
  isStaked,
  isLoading = false,
}) => {
  const { stakingToken, earningToken, stakingLimit, isFinished } = pool
  const { t } = useTranslation()
  const convertedLimit = getDecimalAmount(new BigNumber(stakingLimit), earningToken.decimals)
  const stakingMax =
    stakingLimit && stakingTokenBalance.isGreaterThan(convertedLimit) ? convertedLimit : stakingTokenBalance
  const formattedBalance = formatNumber(getBalanceNumber(stakedBalance, stakingToken.decimals), 3, 3)
  const stakingMaxDollarValue = formatNumber(
    getBalanceNumber(stakedBalance.multipliedBy(stakingTokenPrice), stakingToken.decimals),
  )

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)

  const [onPresentStake] = useModal(
    <StakeModal stakingMax={stakingMax} isBnbPool={isBnbPool} pool={pool} stakingTokenPrice={stakingTokenPrice} />,
  )

  const [onPresentUnstake] = useModal(
    <StakeModal
      stakingMax={stakedBalance}
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenPrice={stakingTokenPrice}
      isRemovingStake
    />,
  )

  const renderStakeAction = () => {
    return isStaked ? (
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column">
          <Heading>{formattedBalance}</Heading>
          <Text fontSize="12px" color="textSubtle">{`~${stakingMaxDollarValue || 0} USD`}</Text>
        </Flex>
        <Flex>
          <IconButton variant="secondary" onClick={onPresentUnstake} mr="6px">
            <MinusIcon color="primary" width="24px" />
          </IconButton>
          <IconButton
            variant="secondary"
            onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}
            disabled={isFinished}
          >
            <AddIcon color="primary" width="24px" height="24px" />
          </IconButton>
        </Flex>
      </Flex>
    ) : (
      <Button disabled={isFinished} onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}>
        {t('Stake')}
      </Button>
    )
  }

  return <Flex flexDirection="column">{isLoading ? <Skeleton width="100%" height="52px" /> : renderStakeAction()}</Flex>
}

export default StakeAction
