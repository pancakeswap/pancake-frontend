import {
  CogIcon,
  IconButton,
  ArrowBackIcon,
  ModalTitle,
  Heading,
  ModalCloseButton,
  LogoRoundIcon,
  Box,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { ModalHeader } from '../../styles'

interface INotifyHeaderprops {
  onBack: (e: React.MouseEvent<HTMLButtonElement>) => void
  onDismiss: () => void
  isEnabled: boolean
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

const NotificationHeader = ({ isSettings = false, isEnabled, onBack, onDismiss }: INotifyHeaderprops) => {
  const { t } = useTranslation()
  return (
    <ModalHeader>
      {!isEnabled ? (
        <>
          <ModalBackButton onBack={onBack} isSettings={isSettings} />
          <ModalTitle>
            <Heading fontSize="20px" padding="0px" textAlign="center">
              {t('Notifications')}
            </Heading>
          </ModalTitle>
          <ModalCloseButton onDismiss={onDismiss} />
        </>
      ) : (
        <Box display="flex" padding="8px">
          <LogoRoundIcon width="40px" mr="12px" />
          <Heading fontSize="24px" padding="0px" textAlign="left" mr="8px">
            {t('PancakeSwap would like to send you notifications')}
          </Heading>
        </Box>
      )}
    </ModalHeader>
  )
}

export default NotificationHeader
