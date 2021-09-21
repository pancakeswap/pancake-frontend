import React from 'react'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { UserStatusEnum } from 'views/PancakeSquad/types'

type ConnectWalletButtonProps = {
  userStatus: UserStatusEnum
}

const ConnectWallet: React.FC<ConnectWalletButtonProps> = ({ userStatus }) => (
  <>{userStatus === UserStatusEnum.UNCONNECTED && <ConnectWalletButton scale="sm" />}</>
)

export default ConnectWallet
