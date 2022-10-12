import { WalletModalV2 } from '@pancakeswap/ui-wallets'
import { Button, ButtonProps } from '@pancakeswap/uikit'
import { createWallets } from 'config/wallet'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useAuth from 'hooks/useAuth'
// @ts-ignore
// eslint-disable-next-line import/extensions
import { useActiveHandle } from 'hooks/useEagerConnect.bmp.ts'
import { useMemo, useState } from 'react'
import { useConnect } from 'wagmi'
import Trans from './Trans'

const ConnectWalletButton = ({ children, ...props }: ButtonProps) => {
  const handleActive = useActiveHandle()
  const { login } = useAuth()
  const { connectAsync } = useConnect()
  const { chainId } = useActiveChainId()
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    if (typeof __NEZHA_BRIDGE__ !== 'undefined') {
      handleActive()
    } else {
      setOpen(true)
    }
  }

  const wallets = useMemo(() => createWallets(chainId, connectAsync), [chainId, connectAsync])

  return (
    <>
      <Button onClick={handleClick} {...props}>
        {children || <Trans>Connect Wallet</Trans>}
      </Button>
      <WalletModalV2 isOpen={open} wallets={wallets} login={login} onDismiss={() => setOpen(false)} />
    </>
  )
}

export default ConnectWalletButton
