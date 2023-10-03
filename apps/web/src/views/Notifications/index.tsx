import { useTranslation } from '@pancakeswap/localization'
import { ArrowBackIcon, Box, CogIcon, Heading, IconButton, LogoRoundIcon, ModalCloseButton } from '@pancakeswap/uikit'
import { usePushClient } from 'contexts/PushClientContext'
import { useCallback, useEffect, useState } from 'react'
import NotificationSettingsMain from 'views/Notifications/containers/NotificationSettings'
import OnBoardingView from 'views/Notifications/containers/OnBoardingView'
import {
  useInitWeb3InboxClient,
  useManageSubscription,
  useW3iAccount,
} from "@web3inbox/widget-react";
import NotificationMenu from './components/NotificationDropdown/NotificationMenu'
import useFormattedEip155Account from './components/hooks/useFormatEip155Account'
import SettingsModal from './containers/NotificationView'
import { ModalHeader, ModalTitle, ViewContainer } from './styles'
import ProgressStepBar from './components/ProgressBar/ProgressBar'
import { DEFAULT_PROJECT_ID } from './constants'

interface INotifyHeaderprops {
  onBack: (e: React.MouseEvent<HTMLButtonElement>) => void
  onDismiss: () => void
  isNotificationView: boolean
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

const NotificationHeader = ({ isSettings = false, onBack, onDismiss, isNotificationView }: INotifyHeaderprops) => {
  const { t } = useTranslation()
  const { eip155Account } = useFormattedEip155Account()

  const checkSubscriptionStatus = () => {
    const subscriptionStatus = localStorage.getItem(`isSubscribed_${eip155Account}`)
    return subscriptionStatus === 'true'
  }

  const hasSubscribedOnce = checkSubscriptionStatus()
  return (
    <>
      {isNotificationView ? (
        <ModalHeader>
          {eip155Account ? <ModalBackButton onBack={onBack} isSettings={isSettings} /> : null}
          <ModalTitle>
            <Heading fontSize="20px" padding="0px" textAlign="center">
              {t('Notifications')}
            </Heading>
          </ModalTitle>
          {eip155Account ? <ModalCloseButton onDismiss={onDismiss} /> : null}
        </ModalHeader>
      ) : !hasSubscribedOnce ? (
        <Box background="#EDEAF4" borderRadius="16px" marginX="24px" marginTop="24px">
          <ProgressStepBar />
        </Box>
      ) : (
        <ModalHeader>
          <Box display="flex" padding="8px" paddingLeft="20px">
            <LogoRoundIcon width="40px" mr="12px" />
            <Heading fontSize="24px" padding="0px" textAlign="left" mr="8px">
              {t('PancakeSwap would like to send you notifications')}
            </Heading>
          </Box>
        </ModalHeader>
      )}
    </>
  )
}

const Notifications = () => {
  const [isRightView, setIsRightView] = useState(true)
  const [isNotificationView, setIsNotificationView] = useState<boolean>(false)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const { eip155Account } = useFormattedEip155Account()
  const isW3iInitialized = useInitWeb3InboxClient({
    projectId: DEFAULT_PROJECT_ID,
    domain: "gm.walletconnect.com",
  });
  const {
    account,
    setAccount,
    register: registerIdentity,
    identityKey,
  } = useW3iAccount();
  const {
    subscribe,
    unsubscribe,
    isSubscribed,
    isSubscribing,
    isUnsubscribing,
  } = useManageSubscription(account);
  // const {
  //   activeSubscriptions,
  //   pushClientProxy: pushClient,
  //   isSubscribed,
  //   refreshNotifications,
  //   pushRegisterMessage,
  // } = usePushClient()

  // const currentSubscription = activeSubscriptions.find((sub) => sub.account === eip155Account)
  // const onBoardingStep: 'identity' | 'sync' = pushRegisterMessage?.includes('did:key') ? 'identity' : 'sync'

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
    let timeoutId: NodeJS.Timeout | null = null
    if (isSubscribed) timeoutId = setTimeout(() => setIsNotificationView(true), 1500)
    else setIsNotificationView(false)

    return () => clearTimeout(timeoutId)
  }, [isSubscribed])

  return (
    <NotificationMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} mr="8px">
      {() => (
        <Box>
          <NotificationHeader
            onBack={toggleSettings}
            onDismiss={onDismiss}
            isSettings={!isRightView}
            isNotificationView={isNotificationView}
          />
          {isNotificationView && eip155Account ? (
            // <ViewContainer isRightView={isRightView}>
            //   <SettingsModal
            //     currentSubscription={currentSubscription}
            //     activeSubscriptions={activeSubscriptions}
            //     pushClient={pushClient}
            //   />
            //   <NotificationSettingsMain
            //     currentSubscription={currentSubscription}
            //     pushClient={pushClient}
            //     refreshNotifications={refreshNotifications}
            //   />
            // </ViewContainer>
            <></>
          ) : (
            <OnBoardingView setIsRightView={setIsRightView} onBoardingStep={'identity'} />
          )}
        </Box>
      )}
    </NotificationMenu>
  )
}

export default Notifications
