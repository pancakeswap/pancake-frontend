import styled from 'styled-components'
import { Skeleton, Text, useTooltip, HelpIcon, Flex, Box, useMatchBreakpoints, Balance, Pool } from '@pancakeswap/uikit'
import { VaultKey } from 'state/types'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { getCakeVaultEarnings } from 'views/Pools/helpers'
import { Token } from '@pancakeswap/sdk'
import AutoEarningsBreakdown from '../../AutoEarningsBreakdown'

interface AutoEarningsCellProps {
  pool: Pool.DeserializedPool<Token>
  account: string
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 4.5;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`

const HelpIconWrapper = styled.div`
  align-self: center;
`

const AutoEarningsCell: React.FC<React.PropsWithChildren<AutoEarningsCellProps>> = ({ pool, account }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { earningTokenPrice, vaultKey } = pool

  const vaultData = useVaultPoolByKey(vaultKey)
  const {
    userData: { userShares, cakeAtLastUserAction, isLoading },
    pricePerFullShare,
  } = vaultData
  const { hasAutoEarnings, autoCakeToDisplay, autoUsdToDisplay } = getCakeVaultEarnings(
    account,
    cakeAtLastUserAction,
    userShares,
    pricePerFullShare,
    earningTokenPrice,
    vaultKey === VaultKey.CakeVault
      ? (vaultData as Pool.DeserializedPoolLockedVault<Token>).userData.currentPerformanceFee
          .plus((vaultData as Pool.DeserializedPoolLockedVault<Token>).userData.currentOverdueFee)
          .plus((vaultData as Pool.DeserializedPoolLockedVault<Token>).userData.userBoostedShare)
      : null,
  )

  const labelText = t('Recent CAKE profit')
  const earningTokenBalance = autoCakeToDisplay
  const hasEarnings = hasAutoEarnings
  const earningTokenDollarBalance = autoUsdToDisplay

  const { targetRef, tooltip, tooltipVisible } = useTooltip(<AutoEarningsBreakdown pool={pool} account={account} />, {
    placement: 'bottom',
  })

  if (vaultKey === VaultKey.CakeVault && !userShares.gt(0)) {
    return null
  }

  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        {isLoading && account ? (
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
      </Pool.CellContent>
    </StyledCell>
  )
}

export default AutoEarningsCell
