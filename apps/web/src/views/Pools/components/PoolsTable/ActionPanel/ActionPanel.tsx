import styled, { keyframes, css } from 'styled-components'
import { Box, Flex, HelpIcon, Text, useMatchBreakpoints, Pool } from '@pancakeswap/uikit'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import BigNumber from 'bignumber.js'
import { VaultKey, DeserializedLockedCakeVault, DeserializedLockedVaultUser } from 'state/types'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { Token } from '@pancakeswap/sdk'
import Harvest from './Harvest'
import Stake from './Stake'
import AutoHarvest from './AutoHarvest'
import { VaultPositionTagWithLabel } from '../../Vault/VaultPositionTag'
import YieldBoostRow from '../../LockedPool/Common/YieldBoostRow'
import LockDurationRow from '../../LockedPool/Common/LockDurationRow'
import useUserDataInVaultPresenter from '../../LockedPool/hooks/useUserDataInVaultPresenter'
import CakeVaultApr from './CakeVaultApr'
import PoolStatsInfo from '../../PoolStatsInfo'
import PoolTypeTag from '../../PoolTypeTag'

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

const StyledActionPanel = styled.div<{ expanded: boolean }>`
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

const ActionContainer = styled.div<{ isAutoVault?: boolean; hasBalance?: boolean }>`
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

type MediaBreakpoints = {
  isXs: boolean
  isSm: boolean
  isMd: boolean
  isLg: boolean
  isXl: boolean
  isXxl: boolean
}

interface ActionPanelProps {
  account: string
  pool: Pool.DeserializedPool<Token>
  expanded: boolean
  breakpoints: MediaBreakpoints
}

const InfoSection = styled(Box)`
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

  return (
    <StyledActionPanel expanded={expanded}>
      <InfoSection>
        {isMobile && vaultKey === VaultKey.CakeVault && isLocked && (
          <Box mb="16px">
            <YieldBoostDurationRow
              lockEndTime={(vaultData as DeserializedLockedCakeVault).userData.lockEndTime}
              lockStartTime={(vaultData as DeserializedLockedCakeVault).userData.lockStartTime}
            />
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
            {pool.vaultKey ? <AutoHarvest {...pool} /> : <Harvest {...pool} />}
            <Stake pool={pool} />
          </ActionContainer>
        </Box>
      </ActionContainer>
    </StyledActionPanel>
  )
}

export default ActionPanel
