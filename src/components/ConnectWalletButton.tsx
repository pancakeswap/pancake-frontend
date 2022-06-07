import { Button, useWalletModal, ButtonProps } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import { useActiveHandle } from 'hooks/useEagerConnect'
import Trans from './Trans'

const ConnectWalletButton = ({ children, ...props }: ButtonProps) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const handleActive = useActiveHandle()
  // const { onPresentConnectModal } = useWalletModal(login, logout, t)
  const handleClick = () => {
    console.log('~ handleClick', handleActive)
    handleActive()
  }

  return (
    <Button onClick={handleClick} {...props}>
      {children || <Trans>Connect Wallet</Trans>}
    </Button>
  )
}

export default ConnectWalletButton
