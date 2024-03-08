import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { MANAGER } from '@pancakeswap/position-managers'
import { Flex, FlexProps, ScanLink } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { PropsWithChildren, memo, useMemo } from 'react'
import { styled } from 'styled-components'
import { SpaceProps } from 'styled-system'
import { Address } from 'viem'

import { getBlockExploreLink } from 'utils'

const StyledScanLink = styled(ScanLink)``

const LinkContainer = styled(Flex)`
  ${StyledScanLink} {
    margin-top: 0.25em;

    &:first-child {
      margin-top: 0;
    }
  }
`

export interface VaultLinksProps extends SpaceProps, FlexProps {
  layout?: 'row' | 'column'
  vaultAddress: Address
  managerInfoUrl: string
  strategyInfoUrl: string
  managerAddress: string
  projectVaultUrl?: string
  manager: {
    id: MANAGER
    name: string
  }
}

const LinkSupportChains = [ChainId.BSC, ChainId.BSC_TESTNET]

export const VaultLinks = memo(function VaultLinks({
  layout = 'column',
  managerInfoUrl,
  strategyInfoUrl,
  // projectVaultUrl,
  managerAddress,
  vaultAddress,
  // manager,
  children,
  ...props
}: PropsWithChildren<VaultLinksProps>) {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()

  // const managerInfo: BaseManager = useMemo(() => baseManagers[manager.id], [manager])

  const useBscCoinFallback = useMemo(() => (chainId ? LinkSupportChains.includes(chainId) : false), [chainId])

  return (
    <LinkContainer flexDirection={layout} {...props}>
      {/* <StyledScanLink href={`https://pancakeswap.finance/info/v3/pairs/${lpAddress}`}>{t('Pair Info')}</StyledScanLink> */}
      <StyledScanLink href={managerInfoUrl}>{t('Manager Info')}</StyledScanLink>
      <StyledScanLink href={strategyInfoUrl}>{t('Strategy Info')}</StyledScanLink>
      <StyledScanLink
        href={getBlockExploreLink(managerAddress, 'address', chainId)}
        useBscCoinFallback={useBscCoinFallback}
      >
        {t('View Manager Address')}
      </StyledScanLink>
      <StyledScanLink
        href={getBlockExploreLink(vaultAddress, 'address', chainId)}
        useBscCoinFallback={useBscCoinFallback}
      >
        {t('View Vault Contract')}
      </StyledScanLink>
      {/* {projectVaultUrl && managerInfo && (
        <StyledScanLink href={projectVaultUrl} icon={<PlayCircleOutlineIcon />}>
          {t('View Vault on %managerName%', { managerName: managerInfo.name })}
        </StyledScanLink>
      )} */}
      {children}
    </LinkContainer>
  )
})
