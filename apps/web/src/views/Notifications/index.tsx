import { useTranslation } from '@pancakeswap/localization'
import { ArrowBackIcon, Box, CogIcon, Heading, IconButton, LogoRoundIcon, ModalCloseButton } from '@pancakeswap/uikit'
import { useManageSubscription } from '@web3inbox/widget-react'
import { useCallback, useEffect, useState } from 'react'
import OnBoardingView from 'views/Notifications/containers/OnBoardingView'
import NotificationMenu from './components/NotificationDropdown/NotificationMenu'
import useRegistration from './components/hooks/useRegistration'
import NotificationSettingsView from './containers/NotificationSettings'
import NotificationView from './containers/NotificationView'
import { ModalHeader, ModalTitle, ViewContainer } from './styles'

interface INotifyHeaderprops {
  onBack: (e: React.MouseEvent<HTMLButtonElement>) => void
  isNotificationView: boolean
  isSettings?: boolean
  onDismiss: () => void
}

const NotificationHeader = ({ isSettings = false, onBack, isNotificationView, onDismiss }: INotifyHeaderprops) => {
  const { t } = useTranslation()
  return (
    <>
      {isNotificationView ? (
        <ModalHeader>
          <IconButton variant="text" onClick={onBack} area-label="go back" mr="8px">
            {isSettings ? <ArrowBackIcon color="primary" /> : <ModalCloseButton onDismiss={onDismiss} />}
          </IconButton>
          <ModalTitle>
            <Heading fontSize="20px" padding="0px" textAlign="center">
              {t('Notifications')}
            </Heading>
          </ModalTitle>
          <IconButton variant="text" onClick={onBack} area-label="go back" mr="8px">
            {isSettings ? <ModalCloseButton onDismiss={onDismiss} /> : <CogIcon color="primary" />}
          </IconButton>
        </ModalHeader>
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
  const [viewIndex, setViewIndex] = useState(1)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const { account, identityKey, handleRegistration, address, isW3iInitialized } = useRegistration()
  const { isSubscribed } = useManageSubscription(account)

  const toggleSettings = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      if (viewIndex === 0 || viewIndex === 2) setViewIndex(1)
      else setViewIndex(2)
    },
    [setViewIndex, viewIndex],
  )

  const onDismiss = useCallback(() => setIsMenuOpen(false), [setIsMenuOpen])
  const isReady = Boolean(isSubscribed && address && isW3iInitialized)

  useEffect(() => {
    if (!address || !isReady) setViewIndex(0)
    if (isReady) setViewIndex(1)
  }, [address, isReady])

  return (
    <NotificationMenu
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
      isSubscribed={isSubscribed}
      identityKey={identityKey}
      handleRegistration={handleRegistration}
    >
      {() => (
        <Box>
          <NotificationHeader
            onBack={toggleSettings}
            isSettings={Boolean(viewIndex === 2)}
            isNotificationView={isReady}
            onDismiss={onDismiss}
          />
          <ViewContainer viewIndex={viewIndex}>
            <OnBoardingView
              identityKey={identityKey}
              handleRegistration={handleRegistration}
              isReady={isW3iInitialized}
            />
            <NotificationView />
            <NotificationSettingsView />
          </ViewContainer>
        </Box>
      )}
    </NotificationMenu>
  )
}

export default Notifications
