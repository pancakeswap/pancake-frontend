import React from 'react'
import { Flex, Box, Text, Button, IconButton, AddIcon, MinusIcon, Heading, useModal } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'
import { Token } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import { getBalanceNumber, formatNumber } from 'utils/formatBalance'
import StakeModal from '../StakeModal'

interface StakeActionsProps {
  stakingTokenBalance: BigNumber
  stakingTokenPrice: number
  stakingToken: Token
  earningToken: Token
  stakedBalance: BigNumber
  stakingLimit?: number
  sousId: number
  isBnbPool: boolean
  isStaked: ConstrainBoolean
}

const StakeAction: React.FC<StakeActionsProps> = ({
  stakingTokenBalance,
  stakingTokenPrice,
  stakingToken,
  earningToken,
  stakedBalance,
  stakingLimit,
  sousId,
  isBnbPool,
  isStaked,
}) => {
  const TranslateString = useI18n()
  const convertedLimit = new BigNumber(stakingLimit).multipliedBy(new BigNumber(10).pow(earningToken.decimals))
  const stakingMax =
    stakingLimit && stakingTokenBalance.isGreaterThan(convertedLimit) ? convertedLimit : stakingTokenBalance
  const formattedBalance = formatNumber(getBalanceNumber(stakingMax, stakingToken.decimals), 3, 3)
  const stakingMaxDollarValue = formatNumber(
    getBalanceNumber(stakingMax.multipliedBy(stakingTokenPrice), stakingToken.decimals),
  )

  const [onPresentStake] = useModal(
    <StakeModal
      stakingMax={stakingMax}
      isBnbPool={isBnbPool}
      sousId={sousId}
      stakingToken={stakingToken}
      stakingTokenPrice={stakingTokenPrice}
    />,
  )

  const [onPresentUnstake] = useModal(
    <StakeModal
      stakingMax={stakingMax}
      isBnbPool={isBnbPool}
      sousId={sousId}
      stakingToken={stakingToken}
      stakingTokenPrice={stakingTokenPrice}
      isRemovingStake
    />,
  )

  return (
    <Flex flexDirection="column">
      {isStaked ? (
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
        <Button onClick={onPresentStake}>{TranslateString(1070, 'Stake')}</Button>
      )}
    </Flex>
  )
}

export default StakeAction
