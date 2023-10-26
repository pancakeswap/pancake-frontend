import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  CogIcon,
  FlexGap,
  IconButton,
  ModalCloseButton,
  OptionProps,
  Select,
  Text,
} from '@pancakeswap/uikit'
import { NotifyClientTypes } from '@walletconnect/notify-client'
import { useMessages } from '@web3inbox/widget-react'
import { useCallback, useMemo, useState } from 'react'
import { NotificationFilterTypes } from 'views/Notifications/constants'
import { FilterContainer, LabelWrapper, NotificationContainerStyled } from 'views/Notifications/styles'
import NotificationItem from '../components/NotificationItem/NotificationItem'
import { SubsctiptionType } from '../types'
import { NotificationHeader } from '../components/NotificationHeader/NotificationHeader'

interface INotificationFilterProps {
  options: OptionProps[]
  onOptionChange: (option: OptionProps) => void
  description: string
}

const NotificationFilter = ({ options, onOptionChange, description }: INotificationFilterProps) => {
  return (
    <FilterContainer>
      <LabelWrapper>
        <Text textTransform="uppercase" mb="4px" ml="4px">
          {description}
        </Text>
        <Select onOptionChange={onOptionChange} options={options} />
      </LabelWrapper>
    </FilterContainer>
  )
}

const NotificationView = ({
  toggleSettings,
  onDismiss,
}: {
  toggleSettings: (e: React.MouseEvent<HTMLButtonElement>) => void
  onDismiss: () => void
}) => {
  const [notificationType, setNotificationType] = useState<string>('All')
  const [isClosing, setIsClosing] = useState<boolean>(false)
  const { messages: notifications, deleteMessage } = useMessages()
  const { t } = useTranslation()

  const handleNotifyOptionChange = useCallback((option: OptionProps) => {
    setNotificationType(option.value)
  }, [])

  const removeAllNotifications = useCallback(async () => {
    setIsClosing(true)
    setTimeout(() => {
      notifications.forEach((notification) => {
        deleteMessage(notification.id)
      })
      setIsClosing(false)
    }, 400)
  }, [notifications, deleteMessage])

  const filteredNotifications: any = useMemo(() => {
    const typeFilter = (
      subscriptionType: SubsctiptionType,
      unFilteredNotifications: NotifyClientTypes.NotifyMessageRecord[],
    ) => {
      return unFilteredNotifications.filter((notification: NotifyClientTypes.NotifyMessageRecord) => {
        const extractedType = notification.message.type
        return extractedType === subscriptionType
      })
    }
    const sortNotifications = (unFilteredNotifications: NotifyClientTypes.NotifyMessageRecord[]): any[] => {
      switch (notificationType) {
        case SubsctiptionType.Lottery:
          return typeFilter(SubsctiptionType.Lottery, unFilteredNotifications)
        case SubsctiptionType.Prediction:
          return typeFilter(SubsctiptionType.Prediction, unFilteredNotifications)
        case SubsctiptionType.Liquidity:
          return typeFilter(SubsctiptionType.Liquidity, unFilteredNotifications)
        case SubsctiptionType.Farms:
          return typeFilter(SubsctiptionType.Farms, unFilteredNotifications)
        case SubsctiptionType.PriceUpdates:
          return typeFilter(SubsctiptionType.PriceUpdates, unFilteredNotifications)
        case SubsctiptionType.Promotional:
          return typeFilter(SubsctiptionType.Promotional, unFilteredNotifications)
        case SubsctiptionType.Alerts:
          return typeFilter(SubsctiptionType.Alerts, unFilteredNotifications)
        default:
          return notifications
      }
    }
    return sortNotifications(notifications)
  }, [notifications, notificationType])

  return (
    <Box paddingBottom="24px" width="100%">
      <NotificationHeader
        leftIcon={
          <IconButton tabIndex={-1} variant="text" onClick={onDismiss} area-label="go back" mr="8px">
            <ModalCloseButton onDismiss={onDismiss} />
          </IconButton>
        }
        rightIcon={
          <IconButton tabIndex={-1} variant="text" onClick={toggleSettings} area-label="go back" mr="8px">
            <CogIcon color="primary" />
          </IconButton>
        }
        text={t('Notifications')}
      />
      <FlexGap alignItems="center" justifyContent="flex-start" paddingX="24px" marginBottom="8px" gap="12px">
        <NotificationFilter
          onOptionChange={handleNotifyOptionChange}
          options={NotificationFilterTypes}
          description="Filter By Type"
        />
        <Button
          tabIndex={-1}
          marginTop="20px"
          height="40px"
          maxWidth="95px"
          variant="secondary"
          onClick={removeAllNotifications}
        >
          <Text px="4px" fontWeight="bold" color="primary">
            {t('Clear')}
          </Text>
        </Button>
      </FlexGap>
      <NotificationContainerStyled>
        <NotificationItem notifications={filteredNotifications} isClosing={isClosing} />
      </NotificationContainerStyled>
    </Box>
  )
}

export default NotificationView
