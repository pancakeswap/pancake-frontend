import styled from 'styled-components'
import { SpaceProps } from 'styled-system'
import { PropsWithChildren, memo, useMemo } from 'react'
import { FlexProps, Flex, ScanLink } from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/swap-sdk-core'
import { MANAGER } from '@pancakeswap/position-managers'
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
  currencyA: Currency
  currencyB: Currency
  vaultId?: string | number
  positionId?: string
  managerId?: MANAGER
}

export const VaultLinks = memo(function VaultLinks({
  layout = 'column',
  currencyA,
  // currencyB,
  // positionId,
  vaultId,
  managerId,
  children,
  ...props
}: PropsWithChildren<Props>) {
  const { t } = useTranslation()
  const { chainId } = currencyA

  // TODO: mock
  const managerContractAddress = useMemo(
    () => managerId !== undefined && getBlockExploreLink(managerId, 'address', chainId),
    [managerId, chainId],
  )
  const vaultContractAddress = useMemo(
    () => vaultId !== undefined && getBlockExploreLink(vaultId, 'address', chainId),
    [vaultId, chainId],
  )

  const managerLink = managerContractAddress ? (
    <StyledScanLink chainId={chainId} href={managerContractAddress}>
      {t('View Manager')}
    </StyledScanLink>
  ) : null
  const vaultLink = vaultContractAddress ? (
    <StyledScanLink chainId={chainId} href={vaultContractAddress}>
      {t('View Vault Contract')}
    </StyledScanLink>
  ) : null

  return (
    <LinkContainer flexDirection={layout} {...props}>
      {managerLink}
      {vaultLink}
      {children}
    </LinkContainer>
  )
})
