import React from 'react'
import ConnectWalletButton from 'components/ConnectWalletButton'

type ConnectWalletButtonProps = {
  isUserUnconnected: boolean
}

const ConnectWallet: React.FC<ConnectWalletButtonProps> = ({ isUserUnconnected }) => (
  <>{isUserUnconnected && <ConnectWalletButton scale="sm" />}</>
)

export default ConnectWallet
