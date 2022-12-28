import { Flex, LinkExternal, Pool, Text, TimerIcon } from '@pancakeswap/uikit'
import { memo } from 'react'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { Token } from '@pancakeswap/sdk'
import { useTranslation } from '@pancakeswap/localization'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'

import { AprInfo, TotalStaked } from './Stat'

interface ExpandedFooterProps {
  pool: Pool.DeserializedPool<Token> & { stakeLimitEndBlock?: number }
  account?: string
  showTotalStaked?: boolean
  alignLinksToRight?: boolean
}

const PoolStatsInfo: React.FC<React.PropsWithChildren<ExpandedFooterProps>> = ({ pool, showTotalStaked = true }) => {
  const { t } = useTranslation()

  const {
    stakingToken,
    earningToken,
    totalStaked = BIG_ZERO,
    userData: poolUserData,
    stakingLimit = BIG_ZERO,
    endBlock = 0,
    startBlock = 0,
    stakeLimitEndBlock = 0,
  } = pool

  const stakedBalance = poolUserData?.stakedBalance ? poolUserData.stakedBalance : BIG_ZERO

  const currentDate = new Date().getTime() / 1000

  const poolTimeRemaining = endBlock - currentDate
  const stakeLimitTimeRemaining = stakeLimitEndBlock + startBlock - currentDate

  const endTimeObject = getTimePeriods(poolTimeRemaining)

  return (
    <>
      <AprInfo pool={pool} stakedBalance={stakedBalance} />
      {showTotalStaked && <TotalStaked totalStaked={totalStaked} stakingToken={stakingToken} />}
      {stakingLimit?.gt(0) ? (
        <>
          <Flex justifyContent="space-between" alignItems="center">
            <Text small>{t('Max. stake per user')}:</Text>
            <Text small>{`${getFullDisplayBalance(stakingLimit, stakingToken.decimals, 0)} ${
              stakingToken.symbol
            }`}</Text>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center">
            <Text small>{t('Max. stake limit ends in')}:</Text>
            <Flex>
              <Text color="textSubtle" small>
                {stakeLimitTimeRemaining > 0 ? getTimePeriods(stakeLimitTimeRemaining)?.days : '0'} days
              </Text>
              <TimerIcon ml="4px" color="primary" />
            </Flex>
          </Flex>
        </>
      ) : null}
      <Flex justifyContent="space-between" alignItems="center">
        <Text small>{t('Pool ends in')}:</Text>
        <Flex>
          <Text color="textSubtle" small>
            {poolTimeRemaining > 0 ? endTimeObject?.days : '0'} days
          </Text>
          <TimerIcon ml="4px" color="primary" />
        </Flex>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex />
        <LinkExternal href={earningToken.projectLink} bold={false} small>
          {t('View Project Site')}
        </LinkExternal>
      </Flex>
    </>
  )
}

export default memo(PoolStatsInfo)
