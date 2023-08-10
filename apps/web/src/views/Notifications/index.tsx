import { useTranslation } from '@pancakeswap/localization'
import { ArrowBackIcon, Box, CogIcon, Heading, IconButton, LogoRoundIcon, ModalCloseButton } from '@pancakeswap/uikit'
import { useWalletConnectPushClient } from 'contexts/PushClientContext'
import { useCallback, useEffect, useState } from 'react'
import NotificationSettingsMain from 'views/Notifications/containers/NotificationSettings'
import OnBoardingView from 'views/Notifications/containers/OnBoardingView'
import { useAccount } from 'wagmi'
import NotificationMenu from './components/NotificationDropdown/NotificationMenu'
import useFormattedEip155Account from './components/hooks/useFormatEip155Account'
import SettingsModal from './containers/NotificationView'
import { ModalHeader, ModalTitle, View, ViewContainer } from './styles'
import { SubscriptionState } from './types'

export const initialState: SubscriptionState = {
  isSubscribing: false,
  isSubscribed: false,
  isUnsubscribing: false,
  isOnboarding: false,
  isOnboarded: false,
}

interface INotifyHeaderprops {
  onBack: (e: React.MouseEvent<HTMLButtonElement>) => void
  onDismiss: () => void
  isSubscribed: boolean
  isSettings?: boolean
}

const ModalBackButton: React.FC<
  React.PropsWithChildren<{ onBack: (e: React.MouseEvent<HTMLButtonElement>) => void; isSettings: boolean }>
> = ({ onBack, isSettings }) => {
  return (
    <IconButton variant="text" onClick={onBack} area-label="go back" mr="8px">
      {isSettings ? <ArrowBackIcon color="primary" /> : <CogIcon color="primary" />}
    </IconButton>
  )
}

const NotificationHeader = ({ isSettings = false, isSubscribed, onBack, onDismiss }: INotifyHeaderprops) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  return (
    <ModalHeader>
      {isSubscribed ? (
        <>
          {account ? <ModalBackButton onBack={onBack} isSettings={isSettings} /> : null}
          <ModalTitle>
            <Heading fontSize="20px" padding="0px" textAlign="center">
              {t('Notifications')}
            </Heading>
          </ModalTitle>
          {account ? <ModalCloseButton onDismiss={onDismiss} /> : null}
        </>
      ) : (
        <Box display="flex" padding="8px" paddingLeft="20px">
          <LogoRoundIcon width="40px" mr="12px" />
          <Heading fontSize="24px" padding="0px" textAlign="left" mr="8px">
            {t('PancakeSwap would like to send you notifications')}
          </Heading>
        </Box>
      )}
    </ModalHeader>
  )
}

const Notifications = () => {
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>(initialState)
  const [isRightView, setIsRightView] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const { formattedEip155Account, account } = useFormattedEip155Account()
  const { activeSubscriptions, registerMessage } = useWalletConnectPushClient()

  const toggleSettings = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      if (isRightView) setIsRightView(false)
      else setIsRightView(true)
    },
    [setIsRightView, isRightView],
  )

  const onDismiss = useCallback(() => setIsMenuOpen(false), [setIsMenuOpen])

  useEffect(() => {
    const pushSignatureRequired = Boolean(registerMessage)
    if (pushSignatureRequired) setSubscriptionState((prevState) => ({ ...prevState, isOnboarded: false }))
    else setSubscriptionState((prevState) => ({ ...prevState, isOnboarded: true }))
  }, [registerMessage, setSubscriptionState, formattedEip155Account])

  useEffect(() => {
    if (Object.values(activeSubscriptions).some((sub) => sub.account === formattedEip155Account)) {
      setSubscriptionState((prevState) => ({ ...prevState, isSubscribed: true }))
    } else setSubscriptionState((prevState) => ({ ...prevState, isSubscribed: false }))
  }, [formattedEip155Account, activeSubscriptions])

  return (
    <NotificationMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} mr="8px">
      {() => (
        <Box>
          <NotificationHeader
            onBack={toggleSettings}
            onDismiss={onDismiss}
            isSubscribed={subscriptionState.isSubscribed}
            isSettings={!isRightView}
          />
          {subscriptionState.isSubscribed && account ? (
            <ViewContainer isRightView={isRightView}>
              <View>
                <SettingsModal />
              </View>
              <View>
                <NotificationSettingsMain
                  setSubscriptionState={setSubscriptionState}
                  subscriptionState={subscriptionState}
                />
              </View>
            </ViewContainer>
          ) : (
            <OnBoardingView setSubscriptionState={setSubscriptionState} subscriptionState={subscriptionState} />
          )}
        </Box>
      )}
    </NotificationMenu>
  )
}

export default Notifications
