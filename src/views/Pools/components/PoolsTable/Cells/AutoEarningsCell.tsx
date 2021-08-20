import React from 'react'
import styled from 'styled-components'
import { Skeleton, Text, useTooltip, HelpIcon, Flex, Box, useMatchBreakpoints } from '@pancakeswap/uikit'
import { Pool } from 'state/types'
import Balance from 'components/Balance'
import { useCakeVault } from 'state/pools/hooks'
import { useTranslation } from 'contexts/Localization'
import { getCakeVaultEarnings } from 'views/Pools/helpers'
import BaseCell, { CellContent } from './BaseCell'

interface AutoEarningsCellProps {
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

const AutoEarningsCell: React.FC<AutoEarningsCellProps> = ({ pool, account, userDataLoaded }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { earningTokenPrice } = pool

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

  const labelText = t('Recent CAKE profit')
  const earningTokenBalance = autoCakeToDisplay
  const hasEarnings = hasAutoEarnings
  const earningTokenDollarBalance = autoUsdToDisplay

  const lastActionInMs = lastUserActionTime && parseInt(lastUserActionTime) * 1000
  const dateTimeLastAction = new Date(lastActionInMs)
  const dateStringToDisplay = dateTimeLastAction.toLocaleString()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Balance fontSize="16px" value={autoCakeToDisplay} decimals={3} bold unit=" CAKE" />
      <Balance fontSize="16px" value={autoUsdToDisplay} decimals={2} bold prefix="~$" />
      {t('Earned since your last action')}
      <Text>{dateStringToDisplay}</Text>
    </>,
    { placement: 'bottom' },
  )

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
