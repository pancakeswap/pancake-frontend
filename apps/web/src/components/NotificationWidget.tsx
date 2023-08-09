import { useTranslation } from '@pancakeswap/localization'
import { Box } from '@pancakeswap/uikit'
import { W3iButton, W3iContext, W3iWidget } from '@web3inbox/widget-react'
import { BuilderNames } from 'config/constants/notifications/types'
import { ConnectorNames } from 'config/wallet'
import useAuth from 'hooks/useAuth'
import useSendPushNotification from 'hooks/useSendNotification'
import { useEffect, useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'

const NotificationWidget = () => {
  const { signMessageAsync } = useSignMessage()
  const { sendPushNotification } = useSendPushNotification()

  const { t } = useTranslation()
  const { address } = useAccount()
  const { login } = useAuth()
  const [account, setAccount] = useState<string | undefined>('')

  useEffect(() => {
    setAccount(address)
  }, [address, setAccount])

  return (
    <W3iContext>
      <div className="W3i" style={{ position: 'relative' }}>
        <Box mr="16px">
          <W3iButton />
        </Box>
        <W3iWidget
          style={{
            position: 'absolute',
            right: '-500%',
            top: '140%',
            display: 'block',
            zIndex: 1,
          }}
          account={account}
          signMessage={async (message) => {
            const rs = await signMessageAsync({ message })
            sendPushNotification(BuilderNames.OnBoardNotification, [])
            return rs as string
          }}
          dappIcon="https://pancakeswap.finance/logo.png"
          connect={() => login('walletConnect' as ConnectorNames)}
          dappName="PancakeSwap"
          dappNotificationsDescription="Get started with notifications from WalletConnect. Click the subscribe button below and accept."
          settingsEnabled
          pushEnabled
          chatEnabled={false}
        />
      </div>
    </W3iContext>
  )
}

export default NotificationWidget
