import { useWalletConnectPushClient } from 'contexts/PushClientContext'
import { useCallback, useEffect, useState } from 'react'
import NotificationSettingsMain from 'views/Notifications/containers/NotificationSettings'
import SubscribedView from 'views/Notifications/containers/OnBoardingView'
import { useAccount, useChainId } from 'wagmi'
import { CogIcon, IconButton, ArrowBackIcon, Heading, ModalCloseButton, LogoRoundIcon, Box } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import NotificationMenu from './components/NotificationDropdown/NotificationMenu'
import SettingsModal from './containers/NotificationView'
import { StyledInputCurrencyWrapper, View, ViewContainer, ModalHeader, ModalTitle } from './styles'
import { SubscriptionState } from './types'

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
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>({
    isSubscribing: false,
    isSubscribed: false,
    isUnsubscribing: false,
    isOnboarding: false,
    isOnboarded: false,
  })

  const [isRightView, setIsRightView] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  const chainId = useChainId()
  const { address: account } = useAccount()
  const {
    pushClient,
    activeSubscriptions,
    getMessageHistory,
    unread,
    setUnread,
    registerMessage: pushRegisterMessage,
    currentSubscription,
  } = useWalletConnectPushClient()

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
    const pushSignatureRequired = Boolean(pushRegisterMessage)
    if (account && pushSignatureRequired) setSubscriptionState((prevState) => ({ ...prevState, isOnboarded: false }))
    else setSubscriptionState((prevState) => ({ ...prevState, isOnboarded: true }))
    setSubscriptionState((prevState) => ({ ...prevState, isOnboarding: false }))
  }, [account, pushRegisterMessage, setSubscriptionState])

  useEffect(() => {
    if (Object.values(activeSubscriptions).some((sub) => sub.account === `eip155:${chainId}:${account}`)) {
      setSubscriptionState((prevState) => ({ ...prevState, isSubscribed: true }))
    }
  }, [account, activeSubscriptions, chainId])

  return (
    <NotificationMenu
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
      mr="8px"
      unread={unread}
      setUnread={setUnread}
    >
      {() => (
        <>
          <NotificationHeader
            onBack={toggleSettings}
            onDismiss={onDismiss}
            isSubscribed={subscriptionState.isSubscribed}
            isSettings={!isRightView}
          />
          <StyledInputCurrencyWrapper>
            {!subscriptionState.isSubscribed || !account ? (
              <SubscribedView setSubscriptionState={setSubscriptionState} subscriptionState={subscriptionState} />
            ) : (
              <ViewContainer isRightView={isRightView}>
                <View>
                  <SettingsModal
                    getMessageHistory={getMessageHistory}
                    pushClient={pushClient}
                    currentSubscription={currentSubscription}
                  />
                </View>
                <View>
                  <NotificationSettingsMain
                    pushClient={pushClient}
                    chainId={chainId}
                    account={account}
                    setSubscriptionState={setSubscriptionState}
                    subscriptionState={subscriptionState}
                    currentSubscription={currentSubscription}
                  />
                </View>
              </ViewContainer>
            )}
          </StyledInputCurrencyWrapper>
        </>
      )}
    </NotificationMenu>
  )
}

export default Notifications
