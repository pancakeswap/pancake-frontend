import { W3iWidget, W3iContext, W3iButton } from '@web3inbox/widget-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Text, useToast } from '@pancakeswap/uikit'
import { ConnectorNames } from 'config/wallet'
import useAuth from 'hooks/useAuth'
import { useAccount, useSignMessage } from 'wagmi'

const NotificationWidget = () => {
  const { toastSuccess, toastError } = useToast()
  const { signMessageAsync } = useSignMessage()

  const { t } = useTranslation()
  const { address } = useAccount()
  const { login } = useAuth()
  const [account, setAccount] = useState<string | undefined>('')

  const SendTestOnboardNotification = useCallback(async () => {
    try {
      const notificationPayload2 = {
        accounts: [`eip155:${1}:${account}`],
        notification: {
          title: 'Welcome',
          body: 'You have successfully joined Pancake Notifications Yaaaay!',
          icon: `https://pancakeswap.finance/logo.png`,
          url: 'https://pancakeswap.finance/logo.png',
          type: 'alerts',
        },
      }

      const notifyResponse = await fetch(
        `https://cast.walletconnect.com/${'ae5413feaf0cdaee02910dc807e03203'}/notify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${'85a7792c-c5d7-486b-b37e-e752918e4866'}`,
          },
          body: JSON.stringify(notificationPayload2),
        },
      )

      const notifyResult = await notifyResponse.json()
      if (notifyResult.success) {
        toastSuccess(
          `${t('Subscription Success')}!`,
          <Text>{t(`You have successfuly subscribed. a confirmation has been sent to your wallet.`)}</Text>,
        )
      }
    } catch (error) {
      console.error({ sendGmError: error })
      toastError(`${t('Something Went Wrong')}!`, <Text>{t(`${error}`)}</Text>)
    }
  }, [account, toastError, toastSuccess, t])

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
          web3inboxUrl="http://localhost:5173/"
          account={account}
          signMessage={async (message) => {
            const rs = await signMessageAsync({ message })
            SendTestOnboardNotification()
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
