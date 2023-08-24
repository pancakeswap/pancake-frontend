import { useTranslation } from '@pancakeswap/localization'
import { ArrowBackIcon, Box, CogIcon, Heading, IconButton, LogoRoundIcon, ModalCloseButton } from '@pancakeswap/uikit'
import W3iContext from 'contexts/W3iContext/context'
import W3iContextProvider from 'contexts/W3iContext'
import { useCallback, useContext, useEffect, useState } from 'react'
import NotificationSettingsMain from 'views/Notifications/containers/NotificationSettings'
import OnBoardingView from 'views/Notifications/containers/OnBoardingView'
import { useAccount } from 'wagmi'
import NotificationMenu from './components/NotificationDropdown/NotificationMenu'
import useFormattedEip155Account from './components/hooks/useFormatEip155Account'
import SettingsModal from './containers/NotificationView'
import { ModalHeader, ModalTitle, ViewContainer } from './styles'

interface INotifyHeaderprops {
  onBack: (e: React.MouseEvent<HTMLButtonElement>) => void
  onDismiss: () => void
  isSubscribed: boolean;
  userPubkey: string
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

const NotificationHeader = ({ isSettings = false, onBack, onDismiss, userPubkey, isSubscribed }: INotifyHeaderprops) => {
  const { t } = useTranslation()
  // const { userPubkey: account } = usePushClient()
  return (
    <ModalHeader>
      {isSubscribed ? (
        <>
          {userPubkey ? <ModalBackButton onBack={onBack} isSettings={isSettings} /> : null}
          <ModalTitle>
            <Heading fontSize="20px" padding="0px" textAlign="center">
              {t('Notifications')}
            </Heading>
          </ModalTitle>
          {userPubkey ? <ModalCloseButton onDismiss={onDismiss} /> : null}
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
  const [isRightView, setIsRightView] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [isOnBoarded, setIsOnBoarded] = useState<boolean>(false)
  
  const {
    chatRegisterMessage,
    chatRegisteredKey,
    userPubkey,
    activeSubscriptions,
    pushClientProxy: pushClient
  } = useContext(W3iContext)

  const { eip155Account } = useFormattedEip155Account()
  const currentSubscription = activeSubscriptions.find((sub) => sub.account === eip155Account)

  useEffect(() => {
    const pushSignatureRequired = !chatRegisteredKey && chatRegisterMessage
    console.log(chatRegisterMessage)
    if (userPubkey && (pushSignatureRequired))  setIsOnBoarded(false)
    else setIsOnBoarded(true)
    
    if (activeSubscriptions.find((sub) => sub.account === eip155Account)) setIsSubscribed(true)
    else setIsSubscribed(false)
  }, [userPubkey, chatRegisteredKey, chatRegisterMessage, activeSubscriptions, eip155Account])

  const toggleSettings = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      if (isRightView) setIsRightView(false)
      else setIsRightView(true)
    },
    [setIsRightView, isRightView],
  )
  const onDismiss = useCallback(() => setIsMenuOpen(false), [setIsMenuOpen])

  return (
    <NotificationMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} mr="8px">
      {() => (
        <Box>
          <NotificationHeader onBack={toggleSettings} onDismiss={onDismiss} isSettings={!isRightView} userPubkey={userPubkey} isSubscribed={isSubscribed}/>
          {isSubscribed && userPubkey ? (
            <ViewContainer isRightView={isRightView}>
              <SettingsModal
                currentSubscription={currentSubscription}
                activeSubscriptions={activeSubscriptions}
                pushClient={pushClient}
              />
              <NotificationSettingsMain currentSubscription={currentSubscription} pushClient={pushClient} />
            </ViewContainer>
          ) : (
            <OnBoardingView setIsRightView={setIsRightView} isOnBoarded={isOnBoarded}/>
          )}
        </Box>
      )}
    </NotificationMenu>
  )
}

const NotificationsState = () => {
  const [isReady, setIsReady] = useState<boolean>(false)
  const { address } = useAccount()

  useEffect(() => {
    if (!address) {
      setIsReady(false)
      return () => null
    }
    const t = setTimeout(() => setIsReady(true), 3000)
    return () => clearTimeout(t)
  }, [address])

  // if (!isReady) return <></>
  return (
    <W3iContextProvider>
      <Notifications />
    </W3iContextProvider>
  )
}

export default NotificationsState
