import { useTranslation } from '@pancakeswap/localization'
import { ArrowBackIcon, Box, CogIcon, Heading, IconButton, LogoRoundIcon, ModalCloseButton } from '@pancakeswap/uikit'
import PushContextProvider, { usePushClient } from 'contexts/PushClientContext'
import { useCallback, useEffect, useState } from 'react'
import NotificationSettingsMain from 'views/Notifications/containers/NotificationSettings'
import OnBoardingView from 'views/Notifications/containers/OnBoardingView'
import { useAccount, useChainId } from 'wagmi'
import NotificationMenu from './components/NotificationDropdown/NotificationMenu'
import useFormattedEip155Account from './components/hooks/useFormatEip155Account'
import SettingsModal from './containers/NotificationView'
import { ModalHeader, ModalTitle, ViewContainer } from './styles'

interface INotifyHeaderprops {
  onBack: (e: React.MouseEvent<HTMLButtonElement>) => void
  onDismiss: () => void
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

const NotificationHeader = ({ isSettings = false, onBack, onDismiss }: INotifyHeaderprops) => {
  const { t } = useTranslation()
  const { userPubkey: account, isSubscribed } = usePushClient()
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

const Notifications = ({ isMenuOpen, setIsMenuOpen }: any) => {
  const [isRightView, setIsRightView] = useState(true)
  // const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const {
    userPubkey,
    isSubscribed,
    activeSubscriptions,
    pushClientProxy: pushClient,
    refreshNotifications,
  } = usePushClient()
  const { eip155Account } = useFormattedEip155Account()

  const currentSubscription = activeSubscriptions.find((sub) => sub.account === eip155Account)

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
          <NotificationHeader onBack={toggleSettings} onDismiss={onDismiss} isSettings={!isRightView} />
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
            <OnBoardingView setIsRightView={setIsRightView} />
          )}
        </Box>
      )}
    </NotificationMenu>
  )
}

const NotificationsState = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [isReady, setIsReady] = useState<boolean>(false)

  const { address } = useAccount()

  useEffect(() => {
    if (!address) return () => null
    const t = setTimeout(() => setIsReady(true), 8000)
    return () => clearTimeout(t)
  }, [address])

  if (!isReady) return <></>
  return (
    <PushContextProvider>
      <Notifications isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </PushContextProvider>
  )
}

export default NotificationsState
