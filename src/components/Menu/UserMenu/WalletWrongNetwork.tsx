import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Button, Text, Link, HelpIcon, connectorLocalStorageKey, ConnectorNames } from '@pancakeswap/uikit'
import { setupNetwork } from 'utils/wallet'

const StyledLink = styled(Link)`
  width: 100%;
  &:hover {
    text-decoration: initial;
  }
`

interface WalletWrongNetworkProps {
  onDismiss: () => void
}

const WalletWrongNetwork: React.FC<WalletWrongNetworkProps> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const connectorId = window.localStorage.getItem(connectorLocalStorageKey) as ConnectorNames

  const handleSwitchNetwork = async (): Promise<void> => {
    await setupNetwork()
    onDismiss()
  }

  return (
    <>
      <Text mb="24px">{t('You’re connected to the wrong network.')}</Text>
      {connectorId === 'injected' && (
        <Button onClick={handleSwitchNetwork} mb="24px">
          {t('Switch Network')}
        </Button>
      )}
      <StyledLink href="https://docs.pancakeswap.finance/get-started/connection-guide" external>
        <Button width="100%" variant="secondary">
          {t('Learn How')}
          <HelpIcon color="primary" ml="6px" />
        </Button>
      </StyledLink>
    </>
  )
}

export default WalletWrongNetwork
