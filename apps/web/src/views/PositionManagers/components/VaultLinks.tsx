import styled from 'styled-components'
import { SpaceProps } from 'styled-system'
import { PropsWithChildren, memo } from 'react'
import { FlexProps, Flex, ScanLink } from '@pancakeswap/uikit'
import { ChainId } from '@pancakeswap/chains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useTranslation } from '@pancakeswap/localization'

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

interface Props extends SpaceProps, FlexProps {
  layout?: 'row' | 'column'
  lpAddress: string
  managerInfoUrl: string
  strategyInfoUrl: string
  managerAddress: string
  vaultAddress: string
}

const LinkSupportChains = [ChainId.BSC, ChainId.BSC_TESTNET]

export const VaultLinks = memo(function VaultLinks({
  layout = 'column',
  lpAddress,
  managerInfoUrl,
  strategyInfoUrl,
  managerAddress,
  vaultAddress,
  children,
  ...props
}: PropsWithChildren<Props>) {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()

  return (
    <LinkContainer flexDirection={layout} {...props}>
      <StyledScanLink href={`https://pancakeswap.finance/info/v3/pairs${lpAddress}`}>{t('Pair Info')}</StyledScanLink>
      <StyledScanLink href={managerInfoUrl}>{t('Manager Info')}</StyledScanLink>
      <StyledScanLink href={strategyInfoUrl}>{t('Strategy Info')}</StyledScanLink>
      <StyledScanLink
        href={getBlockExploreLink(managerAddress, 'address', chainId)}
        useBscCoinFallback={LinkSupportChains.includes(chainId)}
      >
        {t('View Manager Address')}
      </StyledScanLink>
      <StyledScanLink
        href={getBlockExploreLink(vaultAddress, 'address', chainId)}
        useBscCoinFallback={LinkSupportChains.includes(chainId)}
      >
        {t('View Vault Contract')}
      </StyledScanLink>
      {children}
    </LinkContainer>
  )
})
