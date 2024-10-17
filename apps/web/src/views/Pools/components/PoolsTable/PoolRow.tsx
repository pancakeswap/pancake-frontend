import { useTranslation } from '@pancakeswap/localization'
import { Box, Link, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { Pool } from '@pancakeswap/widgets-internal'
import { memo, useCallback, useMemo } from 'react'
import { useDeserializedPoolByVaultKey, usePool, useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey } from 'state/types'
import { VeCakeBenefitCard } from 'views/CakeStaking/components/SyrupPool/VeCakeCard'

import { Token } from '@pancakeswap/swap-sdk-core'
import { bscTokens } from '@pancakeswap/tokens'
import { GiftTooltip } from 'components/GiftTooltip/GiftTooltip'
import styled from 'styled-components'
import { isAddressEqual } from 'utils'
import { Address } from 'viem'
import { bsc } from 'viem/chains'
import { useIsUserDelegated } from 'views/CakeStaking/hooks/useIsUserDelegated'
import { useChainId } from 'wagmi'
import ActionPanel from './ActionPanel/ActionPanel'
import AprCell from './Cells/AprCell'
import AutoAprCell from './Cells/AutoAprCell'
import AutoEarningsCell from './Cells/AutoEarningsCell'
import EarningsCell from './Cells/EarningsCell'
import NameCell from './Cells/NameCell'
import StakedCell from './Cells/StakedCell'
import TotalStakedCell from './Cells/TotalStakedCell'

const MigrateCell = styled(Pool.BaseCell)`
  padding: 0;
  justify-content: center;
  flex: 7.5;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-grow: 1;
  }
`

export const VaultPoolRow: React.FC<
  React.PropsWithChildren<{ vaultKey: VaultKey; account: string; initialActivity?: boolean }>
> = memo(({ vaultKey, account, initialActivity }) => {
  const { t } = useTranslation()
  const { isLg, isXl, isXxl, isMobile } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const isXLargerScreen = isXl || isXxl
  const pool = useDeserializedPoolByVaultKey(vaultKey) as Pool.DeserializedPoolLockedVault<Token>
  const { totalCakeInVault } = useVaultPoolByKey(vaultKey)
  const isUserDelegated = useIsUserDelegated()

  const { stakingToken, totalStaked } = pool

  const totalStakedBalance = useMemo(() => {
    return getBalanceNumber(totalCakeInVault, stakingToken.decimals)
  }, [stakingToken.decimals, totalCakeInVault])

  return (
    <Pool.ExpandRow initialActivity={initialActivity} panel={<ActionPanel account={account} pool={pool} expanded />}>
      <NameCell pool={pool} />
      {!account || isUserDelegated ? (
        <MigrateCell>
          {isMobile ? (
            <Text fontSize={14} lineHeight="14px">
              {t('This product have been upgraded!')}
            </Text>
          ) : (
            <VeCakeBenefitCard isTableView />
          )}
        </MigrateCell>
      ) : null}
      {account && !isUserDelegated && (
        <>
          {isXLargerScreen && <AutoEarningsCell pool={pool} account={account} />}
          {isXLargerScreen ? <StakedCell pool={pool} account={account} /> : null}
          <AutoAprCell pool={pool} />
          {isLargerScreen && (
            <TotalStakedCell
              stakingToken={stakingToken}
              totalStaked={totalStaked}
              totalStakedBalance={totalStakedBalance}
            />
          )}
        </>
      )}
    </Pool.ExpandRow>
  )
})

const PoolRow: React.FC<React.PropsWithChildren<{ sousId: number; account: string; initialActivity?: boolean }>> = ({
  sousId,
  account,
  initialActivity,
}) => {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { isLg, isXl, isXxl, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const { pool } = usePool(sousId)
  const stakingToken = pool?.stakingToken
  const earningToken = pool?.earningToken
  const totalStaked = pool?.totalStaked

  const totalStakedBalance = useMemo(() => {
    return getBalanceNumber(totalStaked, stakingToken?.decimals)
  }, [stakingToken?.decimals, totalStaked])

  const getNow = useCallback(() => Date.now(), [])

  const tooltip =
    chainId === bsc.id &&
    stakingToken &&
    earningToken &&
    isAddressEqual(stakingToken.address as Address, bscTokens.cake.address) &&
    isAddressEqual(earningToken.address as Address, bscTokens.pepe.address) ? (
      <GiftTooltip>
        <Box>
          <Text lineHeight="110%" as="span">
            {t("Enjoying the APR? Get more PEPE rewards in next month's Syrup Pool by staking more PEPE-BNB LP in our")}
            <Link ml="4px" lineHeight="110%" display="inline !important" href="/farms?chain=bsc" external>
              {t('Farms')}
            </Link>
          </Text>
        </Box>
      </GiftTooltip>
    ) : null

  return pool ? (
    <Pool.ExpandRow initialActivity={initialActivity} panel={<ActionPanel account={account} pool={pool} expanded />}>
      <NameCell pool={pool} tooltip={tooltip} />
      <EarningsCell pool={pool} account={account} />
      {isLargerScreen && stakingToken && (
        <TotalStakedCell
          stakingToken={stakingToken}
          totalStaked={totalStaked}
          totalStakedBalance={totalStakedBalance}
        />
      )}
      <AprCell pool={pool} />
      {isDesktop && <Pool.EndsInCell pool={pool} getNow={getNow} />}
    </Pool.ExpandRow>
  ) : null
}

export default memo(PoolRow)
