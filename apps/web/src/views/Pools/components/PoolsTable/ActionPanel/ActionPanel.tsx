import {
  BalanceWithLoading,
  Box,
  Flex,
  HelpIcon,
  Message,
  MessageText,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'
import { css, keyframes, styled } from 'styled-components'

import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedLockedCakeVault, DeserializedLockedVaultUser, VaultKey } from 'state/types'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import {
  VeCakeButton,
  VeCakeUpdateCardTableView,
  VeCakeMigrateCard,
  VeCakeUpdateCard,
} from 'views/CakeStaking/components/SyrupPool'
import ConvertToFlexibleButton from '../../LockedPool/Buttons/ConvertToFlexibleButton'
import LockDurationRow from '../../LockedPool/Common/LockDurationRow'
import YieldBoostRow from '../../LockedPool/Common/YieldBoostRow'
import useUserDataInVaultPresenter from '../../LockedPool/hooks/useUserDataInVaultPresenter'
import PoolStatsInfo from '../../PoolStatsInfo'
import PoolTypeTag from '../../PoolTypeTag'
import { VaultPositionTagWithLabel } from '../../Vault/VaultPositionTag'
import AutoHarvest from './AutoHarvest'
import CakeVaultApr from './CakeVaultApr'
import Harvest from './Harvest'
import Stake from './Stake'

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 1000px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 1000px;
  }
  to {
    max-height: 0px;
  }
`

export const StyledActionPanel = styled.div<{ expanded: boolean }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.dropdown};
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  padding: 12px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 16px 32px;
  }
`

export const ActionContainer = styled(Box)<{ isAutoVault?: boolean; hasBalance?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  flex-wrap: wrap;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: ${({ isAutoVault }) => (isAutoVault ? 'row' : null)};
    align-items: ${({ isAutoVault, hasBalance }) => (isAutoVault ? (hasBalance ? 'flex-start' : 'stretch') : 'center')};
  }
`

interface ActionPanelProps {
  account: string
  pool: Pool.DeserializedPool<Token>
  expanded: boolean
}

export const InfoSection = styled(Box)`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;

  padding: 8px 8px;
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0;
    flex-basis: 230px;
    ${Text} {
      font-size: 14px;
    }
  }
`

const YieldBoostDurationRow = ({ lockEndTime, lockStartTime }) => {
  const { weekDuration, secondDuration } = useUserDataInVaultPresenter({
    lockEndTime,
    lockStartTime,
  })

  return (
    <>
      <YieldBoostRow secondDuration={secondDuration} />
      <LockDurationRow weekDuration={weekDuration} />
    </>
  )
}

const ActionPanel: React.FC<React.PropsWithChildren<ActionPanelProps>> = ({ account, pool, expanded }) => {
  const { t } = useTranslation()
  const { userData, vaultKey } = pool
  const { isMobile } = useMatchBreakpoints()

  const vaultData = useVaultPoolByKey(vaultKey)
  const {
    userData: {
      balance: { cakeAsBigNumber },
    },
  } = vaultData

  const vaultPosition = getVaultPosition(vaultData.userData)

  const isLocked = (vaultData as DeserializedLockedCakeVault).userData.locked

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO

  const poolStakingTokenBalance = vaultKey
    ? cakeAsBigNumber.plus(stakingTokenBalance)
    : stakedBalance.plus(stakingTokenBalance)

  const originalLockedAmount = getBalanceNumber(vaultData.userData?.lockedAmount)

  return (
    <StyledActionPanel expanded={expanded}>
      <InfoSection>
        {isMobile && vaultKey === VaultKey.CakeVault && isLocked && (
          <Box mb="16px">
            <YieldBoostDurationRow
              lockEndTime={(vaultData as DeserializedLockedCakeVault).userData.lockEndTime}
              lockStartTime={(vaultData as DeserializedLockedCakeVault).userData.lockStartTime}
            />
            <Flex alignItems="center" justifyContent="space-between">
              <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
                {t('Original locked amount')}
              </Text>
              <BalanceWithLoading color="text" bold fontSize="16px" value={originalLockedAmount} decimals={2} />
            </Flex>
          </Box>
        )}
        <Flex flexDirection="column" mb="8px">
          <PoolStatsInfo pool={pool} account={account} showTotalStaked={isMobile} alignLinksToRight={isMobile} />
        </Flex>
        <Flex alignItems="center">
          <PoolTypeTag vaultKey={vaultKey} isLocked={isLocked} account={account}>
            {(tagTargetRef) => (
              <Flex ref={tagTargetRef}>
                <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
              </Flex>
            )}
          </PoolTypeTag>
        </Flex>
      </InfoSection>
      <ActionContainer>
        {isMobile && vaultKey === VaultKey.CakeVault && vaultPosition === VaultPosition.None && (
          <CakeVaultApr pool={pool} userData={vaultData.userData} vaultPosition={vaultPosition} />
        )}
        <Box width="100%">
          {pool.vaultKey === VaultKey.CakeVault && (
            <VaultPositionTagWithLabel
              userData={vaultData.userData as DeserializedLockedVaultUser}
              width={['auto', , 'fit-content']}
              ml={['12px', , , , , '32px']}
            />
          )}
          <ActionContainer isAutoVault={!!pool.vaultKey} hasBalance={poolStakingTokenBalance.gt(0)}>
            {pool.vaultKey ? <AutoHarvest pool={pool} /> : <Harvest {...pool} />}
            <Stake pool={pool} />
          </ActionContainer>
        </Box>
        <Flex width="100%">
          <Message
            variant="warning"
            style={{ width: '100%', marginTop: '16px' }}
            action={
              <Flex alignItems="center" style={{ gap: 24 }}>
                {vaultPosition === VaultPosition.Locked && <VeCakeMigrateCard isTableView />}
                {vaultPosition === VaultPosition.Flexible && <VeCakeUpdateCard isFlexibleStake />}
                {vaultPosition >= VaultPosition.LockedEnd && <VeCakeUpdateCardTableView />}
                {vaultPosition >= VaultPosition.LockedEnd && <ConvertToFlexibleButton />}
                <VeCakeButton type="get" />
              </Flex>
            }
            hideIcon={vaultPosition === VaultPosition.Locked}
          >
            {vaultPosition !== VaultPosition.Locked && (
              <MessageText>
                {vaultPosition === VaultPosition.Flexible
                  ? t('Flexible CAKE pool is discontinued and no longer distributing rewards.  Learn more »')
                  : vaultPosition === VaultPosition.LockedEnd
                  ? t('The lock period has ended. Convert to flexible staking.')
                  : t('The lock period has ended. To avoid more rewards being burned, convert to flexible staking.')}
              </MessageText>
            )}
          </Message>
        </Flex>
      </ActionContainer>
    </StyledActionPanel>
  )
}

export default ActionPanel
