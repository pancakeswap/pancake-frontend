import React from 'react'
import { Button, ConnectorId, useWalletModal } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { injected, walletconnect } from 'connectors'
import useI18n from 'hooks/useI18n'

const UnlockButton = (props) => {
  const TranslateString = useI18n()
  const { account, activate, deactivate } = useWeb3React()
  const handleLogin = (connectorId: ConnectorId) => {
    if (connectorId === 'walletconnect') {
      return activate(walletconnect)
    }
    return activate(injected)
  }

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  return (
    <Button onClick={onPresentConnectModal} {...props}>
      {TranslateString(292, 'Unlock Wallet')}
    </Button>
  )
}

export default UnlockButton
