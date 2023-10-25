import { useTranslation } from '@pancakeswap/localization'
import { ArrowBackIcon, Box, CogIcon, Heading, IconButton, LogoRoundIcon, ModalCloseButton } from '@pancakeswap/uikit'
import { useManageSubscription } from '@web3inbox/widget-react'
import { useCallback, useState } from 'react'
import OnBoardingView from 'views/Notifications/containers/OnBoardingView'
import NotificationMenu from './components/NotificationDropdown/NotificationMenu'
import useRegistration from './components/hooks/useRegistration'
import NotificationSettingsMain from './containers/NotificationSettings'
import SettingsModal from './containers/NotificationView'
import { ModalHeader, ModalTitle, ViewContainer } from './styles'

interface INotifyHeaderprops {
  onBack: (e: React.MouseEvent<HTMLButtonElement>) => void
  onDismiss: () => void
  isNotificationView: boolean
  isSettings?: boolean
  account: string | undefined
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

const NotificationHeader = ({
  isSettings = false,
  onBack,
  onDismiss,
  isNotificationView,
  account,
}: INotifyHeaderprops) => {
  const { t } = useTranslation()
  return (
    <>
      {isNotificationView ? (
        <ModalHeader>
          {account ? <ModalCloseButton onDismiss={onDismiss} /> : null}
          <ModalTitle>
            <Heading fontSize="20px" padding="0px" textAlign="center">
              {t('Notifications')}
            </Heading>
          </ModalTitle>
          {account ? <ModalBackButton onBack={onBack} isSettings={isSettings} /> : null}
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
  const [isRightView, setIsRightView] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const { account, identityKey, handleRegistration } = useRegistration()
  const { isSubscribed } = useManageSubscription(account)

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
    <NotificationMenu
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
      isSubscribed={isSubscribed}
      identityKey={identityKey}
      handleRegistration={handleRegistration}
      mr="8px"
    >
      {() => (
        <Box>
          <NotificationHeader
            onBack={toggleSettings}
            onDismiss={onDismiss}
            isSettings={!isRightView}
            isNotificationView={isSubscribed}
            account={account}
          />
          {isSubscribed && account ? (
            <ViewContainer isRightView={isRightView}>
              <SettingsModal account={account} />
              <NotificationSettingsMain account={account} />
            </ViewContainer>
          ) : (
            <OnBoardingView
              setIsRightView={setIsRightView}
              identityKey={identityKey}
              handleRegistration={handleRegistration}
              account={account}
            />
          )}
        </Box>
      )}
    </NotificationMenu>
  )
}

export default Notifications
