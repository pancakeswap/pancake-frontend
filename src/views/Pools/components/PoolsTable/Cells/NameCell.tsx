import { Text, TokenPairImage as UITokenPairImage, useMatchBreakpoints, Skeleton } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { TokenPairImage } from 'components/TokenImage'
import { vaultPoolConfig } from 'config/constants/pools'
import { useTranslation } from '@pancakeswap/localization'
import { memo } from 'react'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool, VaultKey, DeserializedLockedCakeVault } from 'state/types'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { getVaultPosition, VaultPosition, VaultPositionParams } from 'utils/cakePool'
import BaseCell, { CellContent } from './BaseCell'

interface NameCellProps {
  pool: DeserializedPool
}

const StyledCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    padding-left: 32px;
  }
`

const NameCell: React.FC<React.PropsWithChildren<NameCellProps>> = ({ pool }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { sousId, stakingToken, earningToken, userData, isFinished, vaultKey, totalStaked } = pool
  const vaultData = useVaultPoolByKey(pool.vaultKey)
  const {
    userData: { userShares },
    totalCakeInVault,
  } = vaultData
  const hasVaultShares = userShares.gt(0)

  const stakingTokenSymbol = stakingToken.symbol
  const earningTokenSymbol = earningToken.symbol

  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const isStaked = stakedBalance.gt(0)

  const showStakedTag = vaultKey ? hasVaultShares : isStaked

  let title: React.ReactNode = `${t('Earn')} ${earningTokenSymbol}`
  let subtitle: React.ReactNode = `${t('Stake')} ${stakingTokenSymbol}`
  const showSubtitle = sousId !== 0 || (sousId === 0 && !isMobile)

  if (vaultKey) {
    title = vaultPoolConfig[vaultKey].name
    subtitle = vaultPoolConfig[vaultKey].description
  }

  return (
    <StyledCell role="cell">
      {(totalStaked && totalStaked.gte(0)) || (totalCakeInVault && totalCakeInVault.gte(0)) ? (
        <>
          {vaultKey ? (
            <UITokenPairImage {...vaultPoolConfig[vaultKey].tokenImage} mr="8px" width={40} height={40} />
          ) : (
            <TokenPairImage primaryToken={earningToken} secondaryToken={stakingToken} mr="8px" width={40} height={40} />
          )}
          <CellContent>
            {showStakedTag &&
              (vaultKey === VaultKey.CakeVault ? (
                <StakedCakeStatus
                  userShares={userShares}
                  locked={(vaultData as DeserializedLockedCakeVault).userData.locked}
                  lockEndTime={(vaultData as DeserializedLockedCakeVault).userData.lockEndTime}
                />
              ) : (
                <Text fontSize="12px" bold color={isFinished ? 'failure' : 'secondary'} textTransform="uppercase">
                  {t('Staked')}
                </Text>
              ))}
            <Text bold={!isMobile} small={isMobile}>
              {title}
            </Text>
            {showSubtitle && (
              <Text fontSize="12px" color="textSubtle">
                {subtitle}
              </Text>
            )}
          </CellContent>
        </>
      ) : (
        <>
          <Skeleton mr="8px" width={36} height={36} variant="circle" />
          <CellContent>
            <Skeleton width={30} height={12} mb="4px" />
            <Skeleton width={65} height={12} />
          </CellContent>
        </>
      )}
    </StyledCell>
  )
}

export default NameCell

const stakedStatus = {
  [VaultPosition.None]: { text: '', color: 'secondary' },
  [VaultPosition.Locked]: { text: 'Locked', color: 'secondary' },
  [VaultPosition.LockedEnd]: { text: 'Locked End', color: 'secondary' },
  [VaultPosition.AfterBurning]: { text: 'After Burning', color: 'failure' },
  [VaultPosition.Flexible]: { text: 'Flexible', color: 'success' },
}

export const StakedCakeStatus: React.FC<React.PropsWithChildren<VaultPositionParams>> = memo(
  ({ userShares, locked, lockEndTime }) => {
    const vaultPosition = getVaultPosition({ userShares, locked, lockEndTime })
    const { t } = useTranslation()
    return (
      <Text fontSize="12px" bold color={stakedStatus[vaultPosition].color} textTransform="uppercase">
        {t(stakedStatus[vaultPosition].text)}
      </Text>
    )
  },
)
