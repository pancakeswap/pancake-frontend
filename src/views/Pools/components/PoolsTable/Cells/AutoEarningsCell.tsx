import React from 'react'
import styled from 'styled-components'
import { Skeleton, Text, useTooltip, HelpIcon, Flex, Box, useMatchBreakpoints } from '@pancakeswap/uikit'
import { DeserializedPool } from 'state/types'
import Balance from 'components/Balance'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { useTranslation } from 'contexts/Localization'
import { convertSharesToCake, getCakeVaultEarnings } from 'views/Pools/helpers'
import { differenceInHours } from 'date-fns'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from 'utils/formatBalance'
import { getInterestBreakdown } from 'utils/compoundApyHelpers'
import { vaultPoolConfig } from 'config/constants/pools'
import BaseCell, { CellContent } from './BaseCell'

interface AutoEarningsCellProps {
  pool: DeserializedPool
  account: string
}

const StyledCell = styled(BaseCell)`
  flex: 4.5;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`

const HelpIconWrapper = styled.div`
  align-self: center;
`

const getAutoEarningsInterestBreakdown = (
  pool: DeserializedPool,
  lastActionInMs: number,
  earningTokenDollarBalance: number,
  userShares: BigNumber,
  pricePerFullShare: BigNumber,
  performanceFeeAsDecimal: number,
) => {
  const { stakingTokenPrice, earningTokenPrice, rawApr } = pool
  const autoCompoundFrequency = vaultPoolConfig[pool.vaultKey]?.autoCompoundFrequency ?? 0

  const { cakeAsBigNumber } = convertSharesToCake(userShares, pricePerFullShare)
  return getInterestBreakdown({
    principalInUSD: getBalanceNumber(cakeAsBigNumber.times(stakingTokenPrice)),
    apr: rawApr,
    earningTokenPrice,
    compoundFrequency: autoCompoundFrequency,
    performanceFee: performanceFeeAsDecimal,
  })
}

const getAutoEarningsRoiTimePeriod = (timePeriod: number, interestBreakdown, earningTokenPrice) => {
  const hasInterest = Number.isFinite(interestBreakdown[timePeriod])
  const roiTokens = hasInterest ? interestBreakdown[timePeriod] : 0
  return hasInterest ? roiTokens * earningTokenPrice : 0
}

const AutoEarningsCell: React.FC<AutoEarningsCellProps> = ({ pool, account }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { earningTokenPrice } = pool

  const {
    userData: { isLoading: userDataLoading, cakeAtLastUserAction, userShares, lastUserActionTime },
    fees: { performanceFeeAsDecimal },
    pricePerFullShare,
  } = useVaultPoolByKey(pool.vaultKey)
  const { hasAutoEarnings, autoCakeToDisplay, autoUsdToDisplay } = getCakeVaultEarnings(
    account,
    cakeAtLastUserAction,
    userShares,
    pricePerFullShare,
    earningTokenPrice,
  )

  const labelText = t('Recent CAKE profit')
  const earningTokenBalance = autoCakeToDisplay
  const hasEarnings = hasAutoEarnings
  const earningTokenDollarBalance = autoUsdToDisplay

  const lastActionInMs = lastUserActionTime ? parseInt(lastUserActionTime) * 1000 : 0
  const hourDiffSinceLastAction = differenceInHours(Date.now(), lastActionInMs)
  const earnedCakePerHour = hourDiffSinceLastAction ? earningTokenBalance / hourDiffSinceLastAction : 0
  const earnedUsdPerHour = hourDiffSinceLastAction ? earningTokenDollarBalance / hourDiffSinceLastAction : 0

  const interestBreakdown = getAutoEarningsInterestBreakdown(
    pool,
    lastActionInMs,
    earningTokenDollarBalance,
    userShares,
    pricePerFullShare,
    performanceFeeAsDecimal,
  )
  const roiDay = getAutoEarningsRoiTimePeriod(0, interestBreakdown, earningTokenPrice)
  const roiWeek = getAutoEarningsRoiTimePeriod(1, interestBreakdown, earningTokenPrice)
  const roiMonth = getAutoEarningsRoiTimePeriod(2, interestBreakdown, earningTokenPrice)
  const roiYear = getAutoEarningsRoiTimePeriod(3, interestBreakdown, earningTokenPrice)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text bold>
        {autoCakeToDisplay.toFixed(3)}
        {' CAKE'}
      </Text>
      <Text bold>~${autoUsdToDisplay.toFixed(2)}</Text>
      <Text>{t('Earned since your last action')}:</Text>
      <Text>{new Date(lastActionInMs).toLocaleString()}</Text>
      {hourDiffSinceLastAction ? (
        <>
          <Text>{t('Your average per hour')}:</Text>
          <Text bold>{t('CAKE per hour: %amount%', { amount: earnedCakePerHour.toFixed(2) })}</Text>
          <Text bold>{t('per hour: ~$%amount%', { amount: earnedUsdPerHour.toFixed(2) })}</Text>
        </>
      ) : null}
      <Text>{t('At this rate, you would earn')}:</Text>
      <Text bold>{t('per 1d: ~$%amount%', { amount: roiDay.toFixed(2) })}</Text>
      <Text bold>{t('per 7d: ~$%amount%', { amount: roiWeek.toFixed(2) })}</Text>
      <Text bold>{t('per 30d: ~$%amount%', { amount: roiMonth.toFixed(2) })}</Text>
      <Text bold>{t('per 365d: ~$%amount%', { amount: roiYear.toFixed(2) })}</Text>
    </>,
    { placement: 'bottom' },
  )

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        {userDataLoading && account ? (
          <Skeleton width="80px" height="16px" />
        ) : (
          <>
            {tooltipVisible && tooltip}
            <Flex>
              <Box mr="8px" height="32px">
                <Balance
                  mt="4px"
                  bold={!isMobile}
                  fontSize={isMobile ? '14px' : '16px'}
                  color={hasEarnings ? 'primary' : 'textDisabled'}
                  decimals={hasEarnings ? 5 : 1}
                  value={hasEarnings ? earningTokenBalance : 0}
                />
                {hasEarnings ? (
                  <>
                    {earningTokenPrice > 0 && (
                      <Balance
                        display="inline"
                        fontSize="12px"
                        color="textSubtle"
                        decimals={2}
                        prefix="~"
                        value={earningTokenDollarBalance}
                        unit=" USD"
                      />
                    )}
                  </>
                ) : (
                  <Text mt="4px" fontSize="12px" color="textDisabled">
                    0 USD
                  </Text>
                )}
              </Box>
              {hasEarnings && !isMobile && (
                <HelpIconWrapper ref={targetRef}>
                  <HelpIcon color="textSubtle" />
                </HelpIconWrapper>
              )}
            </Flex>
          </>
        )}
      </CellContent>
    </StyledCell>
  )
}

export default AutoEarningsCell
