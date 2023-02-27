import styled, { keyframes, css } from 'styled-components'
import { Box, Flex, Text, useMatchBreakpoints, Pool, Farm, HelpIcon, useTooltip } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { Coin } from '@pancakeswap/aptos-swap-sdk'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useTranslation } from '@pancakeswap/localization'
import isVaultPool from 'components/Pools/utils/isVaultPool'

import PoolStatsInfo from '../PoolCard/PoolStatsInfo'
import TableActions from './TableActions'
import CakeTableActions from './CakeTableActions'

const { ManualPoolTag } = Farm.Tags

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

interface ActionPanelProps {
  account?: string
  pool: Pool.DeserializedPool<Coin>
  expanded: boolean
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

const ActionPanel: React.FC<React.PropsWithChildren<ActionPanelProps>> = ({ account, pool, expanded }) => {
  const { userData } = pool
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO

  const poolStakingTokenBalance = stakedBalance.plus(stakingTokenBalance)

  const manualTooltipText = t('You must harvest and compound your earnings from this pool manually.')

  const { targetRef, tooltip, tooltipVisible } = useTooltip(manualTooltipText, {
    placement: 'bottom',
  })

  const Actions = isVaultPool() ? CakeTableActions : TableActions

  return (
    <StyledActionPanel expanded={expanded}>
      <InfoSection>
        <Flex flexDirection="column" mb="8px">
          <PoolStatsInfo pool={pool} account={account} showTotalStaked={isMobile} alignLinksToRight={isMobile} />
        </Flex>
        <Flex alignItems="center">
          <ManualPoolTag />
          {tooltipVisible && tooltip}
          <Flex ref={targetRef}>
            <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
          </Flex>
        </Flex>
      </InfoSection>
      <ActionContainer>
        <Box width="100%">
          <ActionContainer isAutoVault={!!pool.vaultKey} hasBalance={poolStakingTokenBalance.gt(0)}>
            <Actions hideLocateAddress pool={pool} account={account} stakedBalance={stakedBalance} />
          </ActionContainer>
        </Box>
      </ActionContainer>
    </StyledActionPanel>
  )
}

export default ActionPanel
