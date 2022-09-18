import { Button, ButtonProps } from '@pancakeswap/uikit'
import { useWallet } from 'hooks/useWallet'
import { Trans } from '@pancakeswap/localization'

export const ConnectWalletButton = ({ children, ...props }: ButtonProps) => {
  const { onPresentConnectModal } = useWallet()

  const handleClick = () => {
    onPresentConnectModal()
  }

  return (
    <Button width="100%" onClick={handleClick} {...props}>
      {children || <Trans>Connect Wallet</Trans>}
    </Button>
  )
}
