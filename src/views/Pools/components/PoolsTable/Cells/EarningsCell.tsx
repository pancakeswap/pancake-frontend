import React from 'react'
import styled from 'styled-components'
import { Skeleton, Text, useTooltip, HelpIcon, Flex, Box, useModal } from '@pancakeswap/uikit'
import { Pool } from 'state/types'
import BigNumber from 'bignumber.js'
import { PoolCategory } from 'config/constants/types'
import { BIG_ZERO } from 'utils/bigNumber'
import { formatNumber, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import Balance from 'components/Balance'
import { useCakeVault, useBusdPriceFromToken } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { convertSharesToCake } from 'views/Pools/helpers'
import BaseCell, { CellContent } from './BaseCell'
import CollectModal from '../../PoolCard/Modals/CollectModal'
import VaultStakeModal from '../../CakeVaultCard/VaultStakeModal'

interface EarningsCellProps {
  pool: Pool
  account: string
  userDataLoaded: boolean
  isAutoVault?: boolean
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

const EarningsCell: React.FC<EarningsCellProps> = ({ pool, account, userDataLoaded, isAutoVault }) => {
  const { t } = useTranslation()
  const { sousId, earningToken, poolCategory, userData } = pool
  const isManualCakePool = sousId === 0

  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  const earningTokenPrice = useBusdPriceFromToken(earningToken.symbol)
  const earningTokenPriceAsNumber = earningTokenPrice && earningTokenPrice.toNumber()
  // These will be reassigned later if its Auto CAKE vault
  let earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  let earningTokenDollarBalance = getBalanceNumber(
    earnings.multipliedBy(earningTokenPriceAsNumber),
    earningToken.decimals,
  )
  let hasEarnings = account && earnings.gt(0)
  const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals)
  const formattedBalance = formatNumber(earningTokenBalance, 3, 3)
  const earningsDollarValue = formatNumber(earningTokenDollarBalance)
  const isBnbPool = poolCategory === PoolCategory.BINANCE

  // Auto CAKE vault calculations
  const {
    userData: { cakeAtLastUserAction, userShares, lastUserActionTime },
    pricePerFullShare,
  } = useCakeVault()
  const hasAutoEarnings =
    account && cakeAtLastUserAction && cakeAtLastUserAction.gt(0) && userShares && userShares.gt(0)
  const { cakeAsBigNumber } = convertSharesToCake(userShares, pricePerFullShare)
  const cakeProfit = cakeAsBigNumber.minus(cakeAtLastUserAction)
  const cakeToDisplay = cakeProfit.gte(0) ? getBalanceNumber(cakeProfit, 18) : 0

  const dollarValueOfCake = cakeProfit.times(earningTokenPriceAsNumber)
  const dollarValueToDisplay = dollarValueOfCake.gte(0) ? getBalanceNumber(dollarValueOfCake, 18) : 0

  const lastActionInMs = lastUserActionTime && parseInt(lastUserActionTime) * 1000
  const dateTimeLastAction = new Date(lastActionInMs)
  const dateStringToDisplay = dateTimeLastAction.toLocaleString()

  const labelText = isAutoVault ? t('Recent CAKE profit') : t('%asset% Earned', { asset: earningToken.symbol })
  earningTokenBalance = isAutoVault ? cakeToDisplay : earningTokenBalance
  hasEarnings = isAutoVault ? hasAutoEarnings : hasEarnings
  earningTokenDollarBalance = isAutoVault ? dollarValueToDisplay : earningTokenDollarBalance

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Balance fontSize="16px" value={cakeToDisplay} decimals={3} bold unit=" CAKE" />
      <Balance fontSize="16px" value={dollarValueToDisplay} decimals={2} bold prefix="~$" />
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
      earningsDollarValue={earningsDollarValue}
      sousId={sousId}
      isBnbPool={isBnbPool}
      isCompoundPool={isManualCakePool}
    />,
  )

  const [onPresentVaultUnstake] = useModal(<VaultStakeModal stakingMax={cakeAsBigNumber} pool={pool} isRemovingStake />)

  const handleEarningsClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    if (isAutoVault) {
      onPresentVaultUnstake()
    } else {
      onPresentCollect()
    }
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
              <Box mr="8px" height="32px" onClick={hasEarnings ? handleEarningsClick : undefined}>
                <Balance
                  mt="4px"
                  bold
                  fontSize="16px"
                  color={hasEarnings ? 'primary' : 'textDisabled'}
                  decimals={hasEarnings ? 5 : 1}
                  value={hasEarnings ? earningTokenBalance : 0}
                />
                {hasEarnings ? (
                  <Balance
                    display="inline"
                    fontSize="12px"
                    color={hasEarnings ? 'textSubtle' : 'textDisabled'}
                    decimals={2}
                    value={earningTokenDollarBalance}
                    unit=" USD"
                    prefix="~"
                  />
                ) : (
                  <Text mt="4px" fontSize="12px" color={hasEarnings ? 'textSubtle' : 'textDisabled'}>
                    0 USD
                  </Text>
                )}
              </Box>
              {isAutoVault && (
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
