import { Flex, LinkExternal, Pool, Text, TimerIcon, useTooltip } from '@pancakeswap/uikit'
import { memo, useMemo } from 'react'
import useLedgerTimestamp from 'hooks/useLedgerTimestamp'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { Token } from '@pancakeswap/sdk'
import { useTranslation } from '@pancakeswap/localization'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { getBlockExploreLinkDefault } from 'utils'
import getContactAddress from 'utils/getContactAddress'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { AprInfo } from './Stat'

interface ExpandedFooterProps {
  pool: Pool.DeserializedPool<Token> & { stakeLimitEndBlock?: number }
  account?: string
  showTotalStaked?: boolean
  alignLinksToRight?: boolean
}

interface EndTimeTooltipComponentProps {
  endTime: number
}

const EndTimeTooltipComponent: React.FC<React.PropsWithChildren<EndTimeTooltipComponentProps>> = ({ endTime }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  return (
    <>
      <Text bold>{t('End Time')}:</Text>
      <Text>
        {new Date(endTime * 1000).toLocaleString(locale, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })}
      </Text>
    </>
  )
}

const PoolStatsInfo: React.FC<React.PropsWithChildren<ExpandedFooterProps>> = ({
  pool,
  showTotalStaked = true,
  alignLinksToRight = true,
}) => {
  const { t } = useTranslation()
  const getNow = useLedgerTimestamp()
  const { chainId } = useActiveWeb3React()

  const {
    stakingToken,
    earningToken,
    totalStaked = BIG_ZERO,
    userData: poolUserData,
    stakingLimit = BIG_ZERO,
    endBlock = 0,
    startBlock = 0,
    stakeLimitEndBlock = 0,
    contractAddress,
  } = pool

  const stakedBalance = poolUserData?.stakedBalance ? poolUserData.stakedBalance : BIG_ZERO

  const currentDate = getNow() / 1000

  const poolTimeRemaining = endBlock - currentDate
  const stakeLimitTimeRemaining = stakeLimitEndBlock + startBlock - currentDate

  const endTimeObject = useMemo(() => getTimePeriods(poolTimeRemaining), [poolTimeRemaining])

  const stakeLimitTimeObject = useMemo(() => getTimePeriods(stakeLimitTimeRemaining), [stakeLimitTimeRemaining])

  const {
    targetRef: endTimeTargetRef,
    tooltip: endTimeTooltip,
    tooltipVisible: endTimeTooltipVisible,
  } = useTooltip(<EndTimeTooltipComponent endTime={endBlock} />)

  const {
    targetRef: stakeLimitTargetRef,
    tooltip: stakeLimitTooltip,
    tooltipVisible: stakeLimitTooltipVisible,
  } = useTooltip(<EndTimeTooltipComponent endTime={stakeLimitEndBlock + startBlock} />)

  const poolContractAddress = getContactAddress(contractAddress[chainId])

  return (
    <>
      <AprInfo pool={pool} stakedBalance={stakedBalance} />
      {showTotalStaked && (
        <Pool.TotalStaked
          totalStaked={totalStaked}
          tokenDecimals={stakingToken.decimals}
          decimalsToShow={3}
          symbol={stakingToken.symbol}
        />
      )}
      {stakingLimit?.gt(0) ? (
        <>
          <Flex justifyContent="space-between" alignItems="center">
            <Text small>{t('Max. stake per user')}:</Text>
            <Text small>{`${getFullDisplayBalance(stakingLimit, stakingToken.decimals, 0)} ${
              stakingToken.symbol
            }`}</Text>
          </Flex>
          {endBlock !== stakeLimitEndBlock && (
            <Flex justifyContent="space-between" alignItems="center">
              <Text small>{t('Max. stake limit ends in')}:</Text>
              <Flex alignItems="center">
                <Text color="textSubtle" small>
                  {stakeLimitTimeRemaining > 0
                    ? stakeLimitTimeObject?.totalDays
                      ? stakeLimitTimeObject?.totalDays === 1
                        ? t('1 day')
                        : t('%days% days', { days: stakeLimitTimeObject?.totalDays })
                      : t('< 1 day')
                    : t('%days% days', { days: 0 })}
                </Text>
                <span ref={stakeLimitTargetRef}>
                  <TimerIcon ml="4px" color="primary" />
                  {stakeLimitTooltipVisible && stakeLimitTooltip}
                </span>
              </Flex>
            </Flex>
          )}
        </>
      ) : null}
      <Flex justifyContent="space-between" alignItems="center">
        <Text small>{t('Pool ends in')}:</Text>
        <Flex alignItems="center">
          <Text color="textSubtle" small>
            {poolTimeRemaining > 0
              ? endTimeObject?.totalDays
                ? endTimeObject?.totalDays === 1
                  ? t('1 day')
                  : t('%days% days', { days: endTimeObject?.totalDays })
                : t('< 1 day')
              : t('%days% days', { days: 0 })}
          </Text>
          <span ref={endTimeTargetRef}>
            <TimerIcon ml="4px" color="primary" />
            {endTimeTooltipVisible && endTimeTooltip}
          </span>
        </Flex>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal href={earningToken.projectLink} bold={false} small>
          {t('View Project Site')}
        </LinkExternal>
      </Flex>
      {poolContractAddress && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <LinkExternal
            isAptosScan
            href={getBlockExploreLinkDefault(poolContractAddress, 'address', chainId)}
            bold={false}
            small
          >
            {t('View Contract')}
          </LinkExternal>
        </Flex>
      )}
    </>
  )
}

export default memo(PoolStatsInfo)
