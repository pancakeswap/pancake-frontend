import React from 'react'
import { Flex, Link, Text, TimerIcon, Balance } from '@pancakeswap/uikit'
import { getBlockExploreLink } from 'utils'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { Token } from '@pancakeswap/sdk'

interface MaxStakeRowProps {
  small?: boolean
  stakingLimit: BigNumber
  currentBlock: number
  stakingLimitEndBlock: number
  stakingToken: Token
  hasPoolStarted: boolean
}

const MaxStakeRow: React.FC<React.PropsWithChildren<MaxStakeRowProps>> = ({
  small = false,
  stakingLimit,
  currentBlock,
  stakingLimitEndBlock,
  stakingToken,
  hasPoolStarted,
}) => {
  const { t } = useTranslation()

  return (
    <Flex flexDirection="column">
      <Flex justifyContent="space-between" alignItems="center">
        <Text small={small}>{t('Max. stake per user')}:</Text>
        <Text small={small}>{`${getFullDisplayBalance(stakingLimit, stakingToken.decimals, 0)} ${
          stakingToken.symbol
        }`}</Text>
      </Flex>
      {hasPoolStarted && (
        <Flex justifyContent="space-between" alignItems="center">
          <Text small={small}>{t('Max. stake limit ends in')}:</Text>
          <Link external href={getBlockExploreLink(stakingLimitEndBlock, 'countdown')}>
            <Balance
              small={small}
              value={Math.max(stakingLimitEndBlock - currentBlock, 0)}
              decimals={0}
              color="primary"
            />
            <Text small={small} ml="4px" color="primary" textTransform="lowercase">
              {t('Blocks')}
            </Text>
            <TimerIcon ml="4px" color="primary" />
          </Link>
        </Flex>
      )}
    </Flex>
  )
}

export default MaxStakeRow
