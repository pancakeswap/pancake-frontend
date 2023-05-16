import styled from 'styled-components'
import { Box, Flex, Skeleton, Text, useMatchBreakpoints, Balance, Pool, useTooltip, HelpIcon } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'

import { useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey } from 'state/types'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { Token } from '@pancakeswap/sdk'
import OriginalLockedInfo from '../../OriginalLockedInfo'

interface StakedCellProps {
  pool: Pool.DeserializedPool<Token>
  account: string
}

const HelpIconWrapper = styled.div`
  align-self: center;
`

const StakedCell: React.FC<React.PropsWithChildren<StakedCellProps>> = ({ pool, account }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  // vault
  const vaultData = useVaultPoolByKey(pool.vaultKey)
  const {
    userData: {
      userShares,
      balance: { cakeAsBigNumber, cakeAsNumberBalance },
      isLoading,
    },
  } = vaultData
  const hasSharesStaked = userShares.gt(0)
  const isVaultWithShares = pool.vaultKey && hasSharesStaked

  // pool
  const { stakingTokenPrice, stakingToken, userData } = pool
  const stakedAutoDollarValue = getBalanceNumber(cakeAsBigNumber.multipliedBy(stakingTokenPrice), stakingToken.decimals)
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals)
  const stakedTokenDollarBalance = getBalanceNumber(
    stakedBalance.multipliedBy(stakingTokenPrice),
    stakingToken.decimals,
  )

  const isLocked =
    pool.vaultKey === VaultKey.CakeVault && (vaultData as Pool.DeserializedPoolLockedVault<Token>).userData.locked
  const labelText = `${pool.stakingToken.symbol} ${isLocked ? t('Locked') : t('Staked')}`

  const hasStaked = account && (stakedBalance.gt(0) || isVaultWithShares)

  const userDataLoading = pool.vaultKey ? isLoading : !pool.userDataLoaded

  const {
    targetRef: tagTargetRefOfLocked,
    tooltip: tagTooltipOfLocked,
    tooltipVisible: tagTooltipVisibleOfLocked,
  } = useTooltip(<OriginalLockedInfo pool={pool} />, {
    placement: 'bottom',
  })

  return (
    <Pool.BaseCell
      role="cell"
      flex={
        pool.vaultKey === VaultKey.CakeFlexibleSideVault
          ? '1 0 162px'
          : pool.vaultKey === VaultKey.CakeVault && !hasStaked
          ? '1 0 120px'
          : '2 0 100px'
      }
    >
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left" verticalAlign="center">
          {labelText}
        </Text>
        {userDataLoading && account ? (
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
                    color={hasStaked ? 'primary' : 'textDisabled'}
                    decimals={hasStaked ? 5 : 1}
                    value={
                      hasStaked
                        ? pool.vaultKey
                          ? Number.isNaN(cakeAsNumberBalance)
                            ? 0
                            : cakeAsNumberBalance
                          : stakedTokenBalance
                        : 0
                    }
                  />
                  {isLocked ? (
                    <>
                      {tagTooltipVisibleOfLocked && tagTooltipOfLocked}
                      <HelpIconWrapper ref={tagTargetRefOfLocked}>
                        <HelpIcon ml="4px" mt="2px" width="20px" height="20px" color="textSubtle" />
                      </HelpIconWrapper>
                    </>
                  ) : null}
                </Flex>
                {hasStaked ? (
                  <Balance
                    display="inline"
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    prefix="~"
                    value={pool.vaultKey ? stakedAutoDollarValue : stakedTokenDollarBalance}
                    unit=" USD"
                  />
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
    </Pool.BaseCell>
  )
}

export default StakedCell
