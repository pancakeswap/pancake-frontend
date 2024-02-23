import { Balance, Box, Flex, HelpIcon, Skeleton, Text, useMatchBreakpoints, useTooltip } from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'
import { styled } from 'styled-components'

import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey } from 'state/types'
import { getCakeVaultEarnings } from 'views/Pools/helpers'
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
  const { earningTokenPrice = 0, vaultKey } = pool

  const vaultData = useVaultPoolByKey(vaultKey as Pool.VaultKey) as Pool.DeserializedPoolLockedVault<Token>
  const { userData = {} as Pool.DeserializedLockedVaultUser, pricePerFullShare } = vaultData
  const {
    userShares,
    cakeAtLastUserAction,
    isLoading,
    currentOverdueFee = new BigNumber(0),
    userBoostedShare = new BigNumber(0),
    currentPerformanceFee = new BigNumber(0),
  } = userData
  const { hasAutoEarnings, autoCakeToDisplay, autoUsdToDisplay } = getCakeVaultEarnings(
    account,
    cakeAtLastUserAction,
    userShares,
    pricePerFullShare,
    earningTokenPrice,
    vaultKey === VaultKey.CakeVault
      ? currentPerformanceFee.plus(currentOverdueFee).plus(userBoostedShare)
      : new BigNumber(0),
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
            <Flex>
              <Box mr="8px" height="32px">
                <Flex>
                  <Balance
                    mt="4px"
                    bold={!isMobile}
                    fontSize={isMobile ? '14px' : '16px'}
                    color={hasEarnings ? 'primary' : 'textDisabled'}
                    decimals={hasEarnings ? 5 : 1}
                    value={hasEarnings ? earningTokenBalance : 0}
                  />
                  {hasEarnings && !isMobile && (
                    <>
                      {tooltipVisible && tooltip}
                      <HelpIconWrapper ref={targetRef}>
                        <HelpIcon ml="4px" mt="2px" color="textSubtle" />
                      </HelpIconWrapper>
                    </>
                  )}
                </Flex>
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
            </Flex>
          </>
        )}
      </Pool.CellContent>
    </StyledCell>
  )
}

export default AutoEarningsCell
