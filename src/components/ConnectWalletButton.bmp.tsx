import React from 'react'
import { Button } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useActiveHandle } from 'hooks/useEagerConnect'

const ConnectWalletButton = (props) => {
  const { t } = useTranslation()
  const handle = useActiveHandle()
  return (
    <Button onClick={handle} {...props}>
      {t('Connect Wallet')}
    </Button>
  )
}

export default ConnectWalletButton
