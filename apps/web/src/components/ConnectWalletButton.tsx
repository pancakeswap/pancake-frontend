import { useTranslation } from '@pancakeswap/localization'
import { WalletModalV2 } from '@pancakeswap/ui-wallets'
import { Button, ButtonProps } from '@pancakeswap/uikit'
import { createWallets, getDocLink } from 'config/wallet'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useAuth from 'hooks/useAuth'
// @ts-ignore
// eslint-disable-next-line import/extensions
import { useActiveHandle } from 'hooks/useEagerConnect.bmp.ts'

import { ChainId } from '@pancakeswap/chains'
import { useMemo, useState } from 'react'
import { logGTMWalletConnectEvent } from 'utils/customGTMEventTracking'
import { useConnect } from 'wagmi'
import { cn } from 'utils/tailwind'
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit'
import Trans from './Trans'

const ConnectWalletButton = ({ children, ...props }: ButtonProps) => {
  const { openConnectModal } = useConnectModal()
  const handleActive = useActiveHandle()
  const {
    t,
    currentLanguage: { code },
  } = useTranslation()

  const handleClick = () => {
    if (typeof __NEZHA_BRIDGE__ !== 'undefined' && !window.ethereum) {
      handleActive()
      openConnectModal?.()
    } else {
      // setOpen(true)
      openConnectModal?.()
    }
  }

  return (
    <>
      <button
        className={cn('rounded-full', 'btn-primary', 'rounded-full')}
        onClick={handleClick}
        {...props}
        type="button"
      >
        {children || <Trans>Connect Wallet</Trans>}
      </button>
    </>
  )
}

export default ConnectWalletButton
