import React from 'react'
import styled from 'styled-components'
import { Skeleton, Text, useTooltip, HelpIcon, Flex, Box, useModal, useMatchBreakpoints } from '@pancakeswap/uikit'
import { Pool } from 'state/types'
import BigNumber from 'bignumber.js'
import { PoolCategory } from 'config/constants/types'
import { BIG_ZERO } from 'utils/bigNumber'
import { formatNumber, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import Balance from 'components/Balance'
import { useCakeVault } from 'state/pools/hooks'
import { useTranslation } from 'contexts/Localization'
import { getCakeVaultEarnings } from 'views/Pools/helpers'
import BaseCell, { CellContent } from './BaseCell'
import CollectModal from '../../PoolCard/Modals/CollectModal'

interface EarningsCellProps {
  pool: Pool
  account: string
  userDataLoaded: boolean
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

const EarningsCell: React.FC<EarningsCellProps> = ({ pool, account, userDataLoaded }) => {
  const { t } = useTranslation()
  const { isXs, isSm } = useMatchBreakpoints()
  const { sousId, earningToken, poolCategory, userData, earningTokenPrice, isAutoVault } = pool
  const isManualCakePool = sousId === 0

  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  // These will be reassigned later if its Auto CAKE vault
  let earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  let earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)
  let hasEarnings = account && earnings.gt(0)
  const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals)
  const formattedBalance = formatNumber(earningTokenBalance, 3, 3)
  const isBnbPool = poolCategory === PoolCategory.BINANCE

  // Auto CAKE vault calculations
  const {
    userData: { cakeAtLastUserAction, userShares, lastUserActionTime },
    pricePerFullShare,
  } = useCakeVault()
  const { hasAutoEarnings, autoCakeToDisplay, autoUsdToDisplay } = getCakeVaultEarnings(
    account,
    cakeAtLastUserAction,
    userShares,
    pricePerFullShare,
    earningTokenPrice,
  )

  const lastActionInMs = lastUserActionTime && parseInt(lastUserActionTime) * 1000
  const dateTimeLastAction = new Date(lastActionInMs)
  const dateStringToDisplay = dateTimeLastAction.toLocaleString()

  const labelText = isAutoVault ? t('Recent CAKE profit') : t('%asset% Earned', { asset: earningToken.symbol })
  earningTokenBalance = isAutoVault ? autoCakeToDisplay : earningTokenBalance
  hasEarnings = isAutoVault ? hasAutoEarnings : hasEarnings
  earningTokenDollarBalance = isAutoVault ? autoUsdToDisplay : earningTokenDollarBalance

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Balance fontSize="16px" value={autoCakeToDisplay} decimals={3} bold unit=" CAKE" />
      <Balance fontSize="16px" value={autoUsdToDisplay} decimals={2} bold prefix="~$" />
      {t('Earned since your last action')}
      <Text>{dateStringToDisplay}</Text>
    </>,
    { placement: 'bottom' },
  )

  const [onPresentCollect] = useModal(
    <CollectModal
      formattedBalance={formattedBalance}
      fullBalance={fullBalance}
      earningToken={earningToken}
      earningsDollarValue={earningTokenDollarBalance}
      sousId={sousId}
      isBnbPool={isBnbPool}
      isCompoundPool={isManualCakePool}
    />,
  )

  const handleEarningsClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    onPresentCollect()
  }

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        {!userDataLoaded && account ? (
          <Skeleton width="80px" height="16px" />
        ) : (
          <>
            {tooltipVisible && tooltip}
            <Flex>
              <Box mr="8px" height="32px" onClick={!isAutoVault && hasEarnings ? handleEarningsClick : undefined}>
                <Balance
                  mt="4px"
                  bold={!isXs && !isSm}
                  fontSize={isXs || isSm ? '14px' : '16px'}
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
              {isAutoVault && hasEarnings && !isXs && !isSm && (
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

export default EarningsCell
